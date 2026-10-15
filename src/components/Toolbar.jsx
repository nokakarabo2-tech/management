import { STATUS_FILTERS } from '../utils/studentUtils.js';

/**
 * Toolbar – search box and status filter for the dashboard.
 * The values live in App state; this component only displays them and
 * reports changes back through callback props (lifting state up).
 *
 * Props:
 *  searchTerm, onSearchChange, statusFilter, onStatusChange,
 *  resultCount (number), totalCount (number)
 */
function Toolbar({ searchTerm, onSearchChange, statusFilter, onStatusChange, resultCount, totalCount }) {
  return (
    <div className="toolbar">
      <div className="toolbar__controls">
        <label className="visually-hidden" htmlFor="search">
          Search students
        </label>
        <input
          id="search"
          type="search"
          className="toolbar__search"
          placeholder="Search by ID, name, email or course…"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <label className="visually-hidden" htmlFor="status-filter">
          Filter by enrollment status
        </label>
        <select
          id="status-filter"
          className="toolbar__filter"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value={STATUS_FILTERS.ALL}>All statuses</option>
          <option value={STATUS_FILTERS.ENROLLED}>Enrolled</option>
          <option value={STATUS_FILTERS.NOT_ENROLLED}>Not enrolled</option>
        </select>
      </div>
      <p className="toolbar__count" aria-live="polite">
        Showing {resultCount} of {totalCount} {totalCount === 1 ? 'student' : 'students'}
      </p>
    </div>
  );
}

export default Toolbar;
