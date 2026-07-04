import { useEffect, useRef } from "react";

const TOTAL = 480;
const src = (i) => `/frames/f${String(i).padStart(4, "0")}.jpg`;

/**
 * Scroll-scrubbed environment: 240 JPEG frames preloaded into memory.
 * On each rAF tick, reads window.scrollY directly, picks the frame at that
 * progress, and draws it to a canvas. No video seeking, no decode latency,
 * no browser throttling — just an array lookup and a drawImage.
 */
export default function Background({ reducedMotion = false, staticFrame = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // When staticFrame is requested (e.g. Products page) or reducedMotion is on,
    // draw a single high-altitude drone frame without preloading 240 images or listening to scroll.
    if (staticFrame || reducedMotion) {
      const img = new Image();
      img.src = src(120);
      img.onload = () => {
        const cw = canvas.width, ch = canvas.height;
        const iw = img.naturalWidth || 1280, ih = img.naturalHeight || 720;
        const scale = Math.max(cw / iw, ch / ih);
        const sw = iw * scale, sh = ih * scale;
        ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
      };
      return () => window.removeEventListener("resize", resize);
    }

    const images = new Array(TOTAL).fill(null);
    let rafId;
    let lastIdx = -1;
    // Smoothed drone lag positions — lerp toward the drone's share of the shake
    let lagX = 0, lagY = 0;

    // Preload every frame into browser memory so drawImage is instant
    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.src = src(i + 1);
      images[i] = img;
    }

    const drawCover = (img) => {
      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth || 1280, ih = img.naturalHeight || 720;
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale, sh = ih * scale;
      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    };

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const idx = Math.min(TOTAL - 1, Math.floor(p * TOTAL));

      if (idx !== lastIdx) {
        const img = images[idx];
        if (img && img.complete && img.naturalWidth > 0) {
          drawCover(img);
          lastIdx = idx;
        } else {
          // Show the nearest already-loaded frame while this one downloads
          for (let j = idx - 1; j >= 0; j--) {
            const fb = images[j];
            if (fb && fb.complete && fb.naturalWidth > 0) {
              drawCover(fb);
              break;
            }
          }
        }
      }

      // Camera-follow shake: the environment wobbles as if the viewport camera
      // is chasing the drone. The drone gets a lagged, attenuated share of the
      // same signal so it drifts slightly behind the camera's correction —
      // reads as "camera trying to keep up with the drone".
      const t = Math.max(0, Math.min(1, (p - 0.10) / 0.90));
      const ascent = t * (2 - t);
      const envAmp  = ascent * 3.8;  // environment wobble amplitude (px)
      const droneAmp = ascent * 0.55; // drone gets a small share of same signal

      const now = performance.now() * 0.001;
      const sx = Math.sin(now * 7.3) * 0.5 + Math.sin(now * 13.7) * 0.3 + Math.sin(now * 2.1) * 0.2;
      const sy = Math.sin(now * 5.9) * 0.5 + Math.sin(now * 11.3) * 0.3 + Math.sin(now * 3.7) * 0.2;
      const sr = (Math.sin(now * 4.1) * 0.6 + Math.sin(now * 9.3) * 0.4) * 0.05;

      if (envAmp > 0.02) {
        // scale(1.05) pads every edge so translates never reveal a gap
        canvas.style.transform = `scale(1.05) translate(${(sx * envAmp).toFixed(2)}px,${(sy * envAmp * 0.55).toFixed(2)}px) rotate(${(sr * ascent).toFixed(4)}deg)`;
      } else {
        canvas.style.transform = "";
      }

      // Drone lag: slow lerp (0.05/frame ≈ 0.4 s lag) toward its attenuated share.
      // This makes the drone drift slightly in the same direction the camera shook,
      // with a beat of delay — like the drone moved and the camera caught up.
      lagX += (sx * droneAmp - lagX) * 0.05;
      lagY += (sy * droneAmp * 0.55 - lagY) * 0.05;
      const root = document.documentElement;
      root.style.setProperty("--drone-lag-x", `${lagX.toFixed(3)}px`);
      root.style.setProperty("--drone-lag-y", `${lagY.toFixed(3)}px`);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      const root = document.documentElement;
      root.style.removeProperty("--drone-lag-x");
      root.style.removeProperty("--drone-lag-y");
    };
  }, [reducedMotion]);

  return (
    <div className="sky" aria-hidden="true">
      <canvas ref={canvasRef} className="sky__video" />
      <div className="sky__vignette" />
    </div>
  );
}
