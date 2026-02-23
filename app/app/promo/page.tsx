'use client';

export default function PromoPage() {
  return (
    <iframe
      src="/promo/index.html"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        background: '#000',
      }}
      allow="autoplay"
    />
  );
}
