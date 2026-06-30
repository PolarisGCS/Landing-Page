import { forwardRef } from "react";

/** Camera framing brackets + boresight reticle. Ref is the parallax target. */
const Hud = forwardRef(function Hud(_props, ref) {
  return (
    <div className="hud" ref={ref}>
      <div className="bracket tl" />
      <div className="bracket tr" />
      <div className="bracket bl" />
      <div className="bracket br" />
      <div className="boresight">
        <span className="a" />
        <span className="b" />
        <span className="c" />
        <span className="d" />
      </div>
    </div>
  );
});

export default Hud;
