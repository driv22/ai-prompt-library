export function SkeletonCard() {
  return (
    <div className="card-surface" style={{ borderRadius: '12px', padding: '1.25rem' }}>
      <div className="skeleton" style={{ height: '20px', width: '45%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '22px', width: '80%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.3rem' }} />
      <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '0.3rem' }} />
      <div className="skeleton" style={{ height: '14px', width: '65%', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ height: '24px', width: '35%' }} />
    </div>
  )
}
