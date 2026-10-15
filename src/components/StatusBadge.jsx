import { formatStatus } from '../utils/studentUtils.js';

/**
 * StatusBadge – coloured pill showing the enrollment status.
 * Uses text as well as colour so the meaning is not conveyed by colour alone.
 *
 * Props:
 *  isEnrolled (boolean)
 */
function StatusBadge({ isEnrolled }) {
  return (
    <span className={`badge ${isEnrolled ? 'badge--success' : 'badge--muted'}`}>
      {formatStatus(isEnrolled)}
    </span>
  );
}

export default StatusBadge;
