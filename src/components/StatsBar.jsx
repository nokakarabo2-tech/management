/**
 * StatCard – small reusable card showing one statistic.
 */
function StatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}

/**
 * StatsBar – summary of the student list. StatCard is reused four times
 * with different props.
 *
 * Props:
 *  stats ({ total, enrolled, notEnrolled, averageAge })
 */
function StatsBar({ stats }) {
  return (
    <section className="stats" aria-label="Student summary">
      <StatCard label="Total students" value={stats.total} />
      <StatCard label="Enrolled" value={stats.enrolled} tone="success" />
      <StatCard label="Not enrolled" value={stats.notEnrolled} tone="muted" />
      <StatCard label="Average age" value={stats.total ? stats.averageAge : '—'} />
    </section>
  );
}

export default StatsBar;
