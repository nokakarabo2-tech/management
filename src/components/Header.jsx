/**
 * Header – shown as a sidebar on the left of the page on large screens,
 * and as a bar across the top on tablets and phones (handled in App.css).
 * It holds the brand mark, the app title and the main actions.
 *
 * Props:
 *  onAddClick   (function) – opens the Add Student modal
 *  onResetClick (function) – restores the sample data
 */
function Header({ onAddClick, onResetClick }) {
  return (
    <header className="sidebar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          S
        </span>
        <h1 className="app-header__title">Student Management System</h1>
      </div>

      <div>
        <p className="sidebar__label">Actions</p>
        <div className="app-header__actions">
          <button type="button" className="button button--accent" onClick={onAddClick}>
            <span aria-hidden="true">+</span> Add student
          </button>
          <button type="button" className="button button--ghost" onClick={onResetClick}>
            Reset sample data
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;