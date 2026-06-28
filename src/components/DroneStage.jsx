import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * Full-bleed drone footage backdrop. `drone_img.png` is shown immediately as
 * the poster/fallback and crossfades out the moment the first real video frame
 * is decoded. The <video> ref is forwarded so the scroll loop can scrub it.
 */
const DroneStage = forwardRef(function DroneStage({ reducedMotion = false }, videoRef) {
  const [ready, setReady] = useState(false);
  const localRef = useRef(null);

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof videoRef === "function") videoRef(node);
    else if (videoRef) videoRef.current = node;
  };

  useEffect(() => {
    if (reducedMotion) return;
    const video = localRef.current;
    if (!video) return;
    let cancelled = false;
    const reveal = () => !cancelled && setReady(true);
    if ("requestVideoFrameCallback" in video) {
      video.requestVideoFrameCallback(reveal);
    } else {
      video.addEventListener("loadeddata", reveal, { once: true });
    }
    video.currentTime = 0.001; // nudge a frame to decode
    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", reveal);
    };
  }, [reducedMotion]);

  return (
    <>
      {!reducedMotion && (
        <video
          ref={setRefs}
          className="scene-media"
          src="/drone.mp4"
          poster="/drone_img.png"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
      <img
        src="/drone_img.png"
        alt="Drone in flight"
        className="scene-media scene-poster"
        style={{ opacity: ready ? 0 : 1 }}
        draggable="false"
        aria-hidden="true"
      />
      <div className="scene-tint" />
    </>
  );
});

export default DroneStage;
