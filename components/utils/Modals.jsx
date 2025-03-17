import Modal from 'react-modal';

const customStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        border: "none",
        borderRadius: "10px",
        padding: "20px",
        minWidth: "400px",
        height: "auto",
    },
    close: {
        position: "absolute",
        top: 0,
        right: 0,
    }
};

Modal.setAppElement("#__next");

const Modals = ({ isOpen, onClose, children }) => {
    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            style={customStyles}
        >
            {children}
        </Modal>
    );
};

export default Modals;