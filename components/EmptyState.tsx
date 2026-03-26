interface Props { onClear: () => void }
export function EmptyState({ onClear }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem', gridColumn: '1 / -1' }}>
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 auto 1.5rem', display: 'block', opacity: 0.25, color: 'var(--text-muted)' }}>
        <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="2.5" />
        <line x1="45" y1="45" x2="64" y2="64" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
      <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No prompts match your search</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try clearing your filters or searching with different keywords</p>
      <button onClick={onClear} style={{ backgroundColor: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Clear all filters</button>
    </div>
  )
}
