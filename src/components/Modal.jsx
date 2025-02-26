import PropTypes from "prop-types"; // Import prop-types
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

// Add prop-type validation
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen must be a boolean and is required
  onClose: PropTypes.func.isRequired, // onClose must be a function and is required
  children: PropTypes.node.isRequired, // children must be a React node and is required
};

export default Modal;
