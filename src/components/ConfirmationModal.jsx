/**
 * ConfirmationModal Component: A custom modal for confirming actions.
 * @param {object} props
 * @param {string} props.message - The confirmation message.
 * @param {function(): void} props.onConfirm - Function to call if the user confirms.
 * @param {function(): void} props.onCancel - Function to call if the user cancels.
 */
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationModal;