import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Right-hand instrument readout. TIME ticks on its own; MODE/ALT/BATT are
 * pushed imperatively from the render loop via the `set()` handle, so no
 * React re-render happens per frame.
 */
const StatLine = forwardRef(function StatLine(_props, ref) {
  const timeRef = useRef(null);
  const modeRef = useRef(null);
  const altRef = useRef(null);
  const batRef = useRef(null);

  useImperativeHandle(ref, () => ({
    set({ mode, alt, batt }) {
      if (modeRef.current) modeRef.current.textContent = mode;
      if (altRef.current) altRef.current.innerHTML = `${Math.round(alt)}<small>m</small>`;
      if (batRef.current) batRef.current.innerHTML = `${Math.round(batt)}<small>%</small>`;
    },
  }));

  useEffect(() => {
    const tick = () => {
      if (!timeRef.current) return;
      const d = new Date();
      timeRef.current.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="statline">
      <div className="row">
        <span className="lab">TIME</span>
        <span className="val" ref={timeRef}>00:00:00</span>
      </div>
      <div className="row">
        <span className="lab">MODE</span>
        <span className="val mode" ref={modeRef}>STABILIZE</span>
      </div>
      <div className="row">
        <span className="lab">ALT</span>
        <span className="val" ref={altRef}>0<small>m</small></span>
      </div>
      <div className="row">
        <span className="lab">BATT</span>
        <span className="val" ref={batRef}>100<small>%</small></span>
      </div>
    </div>
  );
});

export default StatLine;
