/**
 * AlertDialog Component: A custom modal for displaying alert messages.
 * @param {object} props
 * @param {string} props.message - The message to display.
 * @param {function(): void} props.onClose - Function to call when the modal is closed.
 */
const AlertDialog = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Alert</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertDialog;