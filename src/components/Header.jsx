/**
 * Header – brand mark, app title and the main "Add student" action.
 *
 * Props:
 *  onAddClick   (function) – opens the Add Student modal
 *  onResetClick (function) – restores the sample data
 */
function Header({ onAddClick, onResetClick }) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">
            S
          </span>
          <h1 className="app-header__title">Student Management System</h1>
        </div>
        <div className="app-header__actions">
          <button type="button" className="button button--ghost" onClick={onResetClick}>
            Reset sample data
          </button>
          <button type="button" className="button button--accent" onClick={onAddClick}>
            <span aria-hidden="true">+</span> Add student
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
