import Modal from './Modal.jsx';

/**
 * DeleteConfirmModal – asks the user to confirm before a record is removed.
 * Focus starts on "Cancel" so pressing Enter by accident does not delete.
 *
 * Props:
 *  student   (object)   – the student to delete
 *  onConfirm (function) – deletes the student
 *  onCancel  (function) – closes without deleting
 */
function DeleteConfirmModal({ student, onConfirm, onCancel }) {
  return (
    <Modal
      title="Delete student?"
      onClose={onCancel}
      variant="danger"
      footer={
        <>
          <button type="button" className="button button--secondary" onClick={onCancel} data-autofocus>
            Cancel
          </button>
          <button type="button" className="button button--danger" onClick={onConfirm}>
            Delete student
          </button>
        </>
      }
    >
      <p>
        Are you sure you want to delete <strong>{student.fullName}</strong> ({student.id})?
      </p>
      <p className="muted">This permanently removes the record and cannot be undone.</p>
    </Modal>
  );
}

export default DeleteConfirmModal;
