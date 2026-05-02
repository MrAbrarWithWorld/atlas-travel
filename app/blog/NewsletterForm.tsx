'use client';

export default function NewsletterForm() {
  return (
    <form
      style={{
        display: "flex",
        gap: 12,
        maxWidth: 440,
        margin: "0 auto",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="your@email.com"
        style={{
          flex: 1,
          background: "#1c1914",
          border: "1px solid #3a3228",
          borderRadius: 8,
          padding: "12px 16px",
          color: "#ede5d5",
          fontSize: 14,
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          background: "none",
          border: "1px solid #c9a96e",
          borderRadius: 8,
          padding: "12px 20px",
          color: "#c9a96e",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.06em",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Subscribe → It&apos;s Free
      </button>
    </form>
  );
}
