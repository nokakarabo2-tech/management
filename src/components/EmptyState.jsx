/**
 * EmptyState – shown instead of the table when there is nothing to display.
 * Two situations are handled with a conditional:
 *  - there are no students at all          -> offer "Add student"
 *  - students exist but none match filters -> offer "Clear filters"
 *
 * Props:
 *  hasStudents (boolean), onAddClick (function), onClearFilters (function)
 */
function EmptyState({ hasStudents, onAddClick, onClearFilters }) {
  if (hasStudents) {
    return (
      <div className="empty-state">
        <h2 className="empty-state__title">No matching students</h2>
        <p className="muted">No records match your search or filter.</p>
        <button type="button" className="button button--secondary" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <h2 className="empty-state__title">No students yet</h2>
      <p className="muted">Add your first student record to get started.</p>
      <button type="button" className="button button--primary" onClick={onAddClick}>
        Add student
      </button>
    </div>
  );
}

export default EmptyState;
