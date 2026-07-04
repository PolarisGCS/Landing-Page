import { useEffect, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type El = RefObject<HTMLElement | null>;

export interface DroneFlightRefs {
  /** Vertical position + scale of the airframe (the actual climb). */
  lift: El;
  /** Micro-jitter wrapper — shakes while the rotors spool against the ground. */
  shake: El;
  /** Ground contact shadow — shrinks + softens as the drone climbs. */
  shadow: El;
  /** Rotor wash rings on the ground. */
  wash: El;
  /** Dust kicked up at the moment of lift-off. */
  dust: El;
  /** Downwash streaks pushed beneath the drone while flying. */
  downwash: El;
  /** Rotating blade image of each propeller. */
  blades: El[];
  /** Translucent motion-blur disc of each propeller. */
  discs: El[];
}

/** Diagonal counter-rotating pairs, like a real quad. */
const SPIN_DIR = [1, 1, -1, -1];
/** Per-rotor speed trim so the four are never perfectly in sync. */
const SPIN_TRIM = [1.0, 0.965, 1.028, 0.983];

const MAX_VEL = 1820; // peak blade angular velocity (deg/s)
const IDLE_VEL = MAX_VEL * 0.3; // gentle idle spin while frames are still loading (grounded, not flying)
const SPOOL_END = 0.08; // rotors hit full speed by 8% scroll (video ascends fast)
const SPOOL_RATE = 2.0;  // faster inertia to match video's quick climb pace
const LIFTOFF_AT = 0.10; // gear lifts at 10% scroll — early, matching video
const LIFT_VH = 0.55; // how far up the airframe travels, in viewport heights, on screens with room to spare
const TOP_CLEARANCE_PX = 96; // never climb closer to the viewport top than this (clears the fixed nav)
const TILT_DEG = 58; // rotor-plane tilt toward the camera (matches the body's view angle)

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
/** Bell curve peaking at `c`, used for the transient lift-off dust. */
const pulse = (x: number, c: number, w: number) =>
  Math.exp(-((x - c) * (x - c)) / (2 * w * w));

/**
 * The whole take-off. A single page-spanning ScrollTrigger reports progress
 * (0→1); from it we derive the climb, shadow, wash, dust and a shared
 * `--ascent` CSS variable that the environment (ground + clouds) parallaxes
 * against — so the drone holds still on screen while the world drops away and
 * clouds rush down past it, reading as a continuous climb.
 *
 * Blade spin + micro-shake run on gsap.ticker so the rotors spool up with
 * motor inertia rather than snapping to the scrollbar. Transforms/opacity only.
 */
export function useDroneFlight(refs: DroneFlightRefs, reduced = false, locked = false): void {
  // Read via ref inside the ticker so toggling `locked` (frames finish loading
  // mid-session) never tears down and recreates the ScrollTrigger/ticker.
  const lockedRef = useRef(locked);
  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (reduced) {
      root.style.setProperty("--ascent", "0.12");
      root.style.setProperty("--hover-play", "paused");
      if (refs.lift.current) gsap.set(refs.lift.current, { y: -60, scale: 0.97 });
      if (refs.shadow.current) gsap.set(refs.shadow.current, { scale: 0.82, opacity: 0.26 });
      [refs.wash, refs.dust, refs.downwash].forEach((r) =>
        r.current ? gsap.set(r.current, { opacity: 0 }) : null,
      );
      return () => {
        root.style.removeProperty("--ascent");
        root.style.removeProperty("--hover-play");
      };
    }

    const ctx = gsap.context(() => {
      // How far the airframe is *allowed* to climb without leaving the
      // viewport. `.drone-pos` (the lift element's parent) is what CSS
      // breakpoints position — it never itself carries the big lift
      // transform, so its rect reflects the true at-rest position regardless
      // of current scroll. On wide/short desktop layouts the drone starts
      // near the bottom and 55vh of headroom comfortably fits above it; on
      // narrow phones it starts much closer to the top (to clear the
      // terminal card below), so the same fixed 55vh would carry it straight
      // through the nav. Clamping to whatever headroom actually exists
      // fixes that without hand-tuning a per-breakpoint constant.
      const computeLiftPx = () => {
        const restTop = refs.lift.current?.parentElement?.getBoundingClientRect().top ?? 0;
        const headroom = Math.max(0, restTop - TOP_CLEARANCE_PX);
        return Math.min(window.innerHeight * LIFT_VH, headroom);
      };

      let liftPx = computeLiftPx();
      let progress = 0;
      let climb = 0;

      const apply = (p: number) => {
        progress = p;
        // easeOut curve: fast climb off the ground (matches the video's quick
        // initial ascent), decelerating as the drone approaches apex altitude.
        const t = clamp01((p - LIFTOFF_AT) / (1 - LIFTOFF_AT));
        climb = t * (2 - t); // easeOut quadratic — reaches 1 at the apex

        // shared parallax driver for ground + cloud layers (CSS reads this)
        root.style.setProperty("--ascent", climb.toFixed(4));
        // idle-hover bob only once airborne; drone sits still on the ground at rest
        root.style.setProperty("--hover-play", climb > 0.01 ? "running" : "paused");

        if (refs.lift.current) {
          // shrink as it climbs — reads as distance and keeps it in frame
          gsap.set(refs.lift.current, { y: -liftPx * climb, scale: 1 - 0.2 * climb });
        }
        if (refs.shadow.current) {
          gsap.set(refs.shadow.current, {
            scale: 1 - 0.5 * climb,
            opacity: 0.45 * (1 - 0.82 * climb),
          });
        }
        if (refs.wash.current) {
          const washIn = smooth((p - 0.02) / 0.12);
          gsap.set(refs.wash.current, { opacity: washIn * (1 - 0.35 * clamp01((p - 0.6) / 0.4)) });
        }
        if (refs.dust.current) {
          // a burst at lift-off that quickly settles
          gsap.set(refs.dust.current, { opacity: 0.9 * pulse(p, 0.11, 0.07) });
        }
      };

      // ScrollTrigger owns the scroll metrics + viewport-resize refresh.
      // Scroll *progress* is sampled on the ticker (below) rather than via
      // onUpdate — that survives React StrictMode's mount/unmount/mount churn,
      // where rapidly killing + recreating a trigger can drop its scroll
      // listener. Pinning the scroller to `window` also sidesteps the body
      // `overflow-x: hidden` → `overflow-y: auto` quirk (body.scrollTop = 0).
      const st = ScrollTrigger.create({
        scroller: window,
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        invalidateOnRefresh: true,
        onRefresh: () => {
          liftPx = computeLiftPx();
          apply(progress);
        },
      });

      // ---- progress sampling + rotors + shake (all on the ticker) ----
      // Start at the asset's drawn angle (0°) so a stopped prop sits seated in
      // the body's perspective; the per-rotor SPIN_TRIM desyncs them once moving
      // (and at speed they blur into the disc anyway).
      const angle = refs.blades.map(() => 0);
      const vel = refs.blades.map(() => 0);
      // Lerped scroll progress — same 0.10/frame factor as the video scrub in
      // Background.jsx so drone position and environment stay in sync.
      let smoothP = 0;

      const tick = () => {
        const dt = gsap.ticker.deltaRatio() / 60;

        let target;
        if (lockedRef.current) {
          // Grounded while frames are still loading: hold at rest (no lift,
          // no shake, no wash) but keep the rotors visibly idling rather than
          // dead — reads as "engine warming up", not "stuck".
          apply(0);
          target = IDLE_VEL;
        } else {
          const max = ScrollTrigger.maxScroll(window) || 1;
          const rawP = clamp01(window.pageYOffset / max);
          smoothP += (rawP - smoothP) * 0.10;
          apply(smoothP);
          // accelerating spool-up (slow → fast), like a motor coming up to speed
          target = MAX_VEL * Math.pow(clamp01(progress / SPOOL_END), 1.5);
        }
        const k = Math.min(1, dt * SPOOL_RATE);
        let meanSpeed = 0;

        for (let i = 0; i < refs.blades.length; i++) {
          const want = target * SPIN_DIR[i] * SPIN_TRIM[i];
          vel[i] += (want - vel[i]) * k;
          angle[i] += vel[i] * dt;
          meanSpeed += Math.abs(vel[i]);
          const f = clamp01(Math.abs(vel[i]) / MAX_VEL); // 0 stopped → 1 full spin
          const blade = refs.blades[i].current;
          if (blade) {
            // real 3D spin: tilt the rotor plane toward the camera, then rotate
            // about its axis — hub stays pinned, blades sweep the correct ellipse
            blade.style.transform = `rotateX(${TILT_DEG}deg) rotateZ(${angle[i]}deg)`;
            // stay crisp through the spin-up so you watch the blades turn, then
            // melt into the blur disc only near full speed
            blade.style.opacity = (1 - 0.94 * smooth((f - 0.42) / 0.5)).toFixed(3);
          }
          const disc = refs.discs[i]?.current;
          if (disc) disc.style.opacity = (0.95 * smooth((f - 0.34) / 0.5)).toFixed(3);
        }
        meanSpeed /= refs.blades.length || 1;
        const spin = clamp01(meanSpeed / MAX_VEL);

        // downwash beneath the craft, strongest just after lift-off
        if (refs.downwash.current) {
          refs.downwash.current.style.opacity = (spin * (1 - 0.5 * climb) * 0.6).toFixed(3);
        }
        // airframe shudders against the pad while spooling, eases off once airborne
        if (refs.shake.current) {
          const amp = spin * (1 - 0.75 * climb) * 1.4;
          const x = (Math.random() - 0.5) * amp;
          const y = (Math.random() - 0.5) * amp;
          refs.shake.current.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
        }
      };

      gsap.ticker.add(tick);
      apply(0);

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        root.style.removeProperty("--ascent");
        root.style.removeProperty("--hover-play");
      };
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);
}
