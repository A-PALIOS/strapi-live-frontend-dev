import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "4rem 1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: 700,
          lineHeight: 1,
          color: "#1E9BFB",
          margin: 0,
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "#23292E",
          margin: 0,
        }}
      >
        Page not found
      </h2>
      <p style={{ color: "#73777A", maxWidth: 400, margin: 0 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "linear-gradient(180deg, rgba(30,155,251,0.95) 0%, rgba(15,142,214,0.95) 100%)",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.75rem",
          fontWeight: 600,
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(30,155,251,0.35)",
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
