export default function ExplorerLoading() {
  return (
    <div>
      <div className="x-skel mb-3" style={{ width: 180, height: 14 }} />
      <div className="x-skel mb-4" style={{ width: 120, height: 22 }} />
      <section className="x-card">
        <div className="x-card-h">
          <div className="x-skel" style={{ width: 220, height: 16 }} />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="x-skel" style={{ width: `${74 + (i % 4) * 6}%`, height: 14 }} />
          ))}
        </div>
      </section>
    </div>
  )
}
