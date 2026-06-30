import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const COLS = ["Monitor", "Plan", "Launch"];
const ROWS = [
  { role: "Operator", perms: [true, true, true] },
  { role: "Planner", perms: [true, true, false] },
  { role: "Observer", perms: [true, false, false] },
];

/** Role / permission matrix that fills cell-by-cell. */
export default function AccessMatrix({ caption = "access / role-based" }) {
  const reduce = useReducedMotion();
  let cell = 0;
  return (
    <div className="cli">
      <div className="cli-caption">{caption}</div>
      <table className="matrix">
        <thead>
          <tr>
            <th />
            {COLS.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.role}>
              <td className="role">{r.role}</td>
              {r.perms.map((ok, i) => {
                const delay = 0.15 + cell++ * 0.09;
                return (
                  <td key={i}>
                    <motion.span
                      className={ok ? "yes" : "no"}
                      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay, duration: 0.3 }}
                    >
                      {ok ? "●" : "—"}
                    </motion.span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
