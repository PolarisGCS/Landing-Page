export default function GlowHalo({ className = "" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -inset-6 rounded-[2rem] opacity-70 blur-3xl ${className}`}
      style={{
        background:
          "conic-gradient(from 180deg, #4285f4, #fbbc05, #ea4335, #34a853, #4285f4)",
      }}
    />
  );
}
