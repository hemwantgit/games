import React, { useState, useEffect, useCallback, useRef} from "react";
import WordTeacherMode from "../components/WordTeacherMode";
import WordPlayMode from "../components/WordPlayMode";
import { loadWords, saveWords, loadTeacherPin, saveTeacherPin } from "../utils/storageUtils";
import WordHelpModal from "../components/WordHelpModal";
import AlertDialog from "../components/AlertDialog";
import ConfirmationModal from "../components/ConfirmationModal";

const WordGame = () => {
    const [words, setWords] = useState(loadWords);
    const [mode, setMode] = useState('teacher'); // Initial mode is 'teacher'
    const [tempTeacherPin, setTempTeacherPin] = useState(loadTeacherPin); // Load PIN from local storage

    const [showSetPinModal, setShowSetPinModal] = useState(false);
    const [showValidatePinModal, setShowValidatePinModal] = useState(false);
    const [setPinInput, setSetPinInput] = useState('');
    const [validatePinInput, setValidatePinInput] = useState('');
    const [setPinError, setSetPinError] = useState('');
    const [validatePinError, setValidatePinError] = useState('');
    const [showHelpModal, setShowHelpModal] = useState(false);

    // State for custom alert/confirm modals
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const confirmActionRef = useRef(null); // To store the action to perform on confirm

    // Effect to save words and PIN to local storage whenever they change
    useEffect(() => {
        saveWords(words);
    }, [words]);

    useEffect(() => {
        saveTeacherPin(tempTeacherPin);
    }, [tempTeacherPin]);

    // Function to show custom alert
    const showAlert = useCallback((message) => {
        setAlertMessage(message);
        setShowAlertModal(true);
    }, []);

    // Function to show custom confirmation
    const showConfirm = useCallback((message, onConfirm, onCancel) => {
        setConfirmMessage(message);
        confirmActionRef.current = { onConfirm, onCancel };
        setShowConfirmModal(true);
    }, []);

    /**
     * Handles the click on the "Play Mode" button.
     * If no PIN is set, it prompts to set one. Otherwise, it switches to play mode.
     */
    const handlePlayModeButtonClick = () => {
        if (tempTeacherPin === null) {
            setShowSetPinModal(true);
            setSetPinInput(''); // Clear previous input
            setSetPinError(''); // Clear previous error
        } else {
            setMode('play');
        }
    };

    /**
     * Handles the click on the "Teacher Mode" button.
     * If in play mode, it prompts for PIN validation.
     */
    const handleTeacherModeButtonClick = () => {
        if (mode === 'play') {
            setShowValidatePinModal(true);
            setValidatePinInput(''); // Clear previous input
            setValidatePinError(''); // Clear previous error
        } else {
            setMode('teacher'); // Already in teacher mode, no action needed
        }
    };

    /**
     * Handles the submission of the new PIN from the set PIN modal.
     * @param {React.FormEvent} e - The form event.
     */
    const handleSetPinSubmit = (e) => {
        e.preventDefault();
        if (setPinInput.trim().length < 3) { // Simple validation: min 3 characters
            setSetPinError('PIN must be at least 3 characters long.');
            return;
        }
        setTempTeacherPin(setPinInput.trim());
        setShowSetPinModal(false);
        setMode('play'); // Automatically move to play mode after setting PIN
    };

    /**
     * Handles cancelling the setting of a new PIN.
     */
    const handleSetPinCancel = () => {
        setShowSetPinModal(false);
        // Stay in teacher mode if cancelled setting PIN
        setMode('teacher');
    };

    /**
     * Handles the submission of the PIN from the validation modal.
     * @param {React.FormEvent} e - The form event.
     */
    const handleValidatePinSubmit = (e) => {
        e.preventDefault();
        if (validatePinInput === tempTeacherPin) {
            setMode('teacher');
            setShowValidatePinModal(false);
            setValidatePinInput('');
            setValidatePinError('');
        } else {
            setValidatePinError('Incorrect PIN. Please try again.');
        }
    };

    /**
     * Handles cancelling the PIN validation.
     */
    const handleValidatePinCancel = () => {
        setShowValidatePinModal(false);
        // Stay in play mode if cancelled validation
        setMode('play');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4 font-sans antialiased">
            <style>
                {`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
              body {
                font-family: 'Inter', sans-serif;
              }
            `}
            </style>
            <script src="https://cdn.tailwindcss.com"></script>

            <div className="mb-8 flex space-x-4">
                <button
                    onClick={handlePlayModeButtonClick}
                    className={`py-3 px-6 rounded-lg font-bold text-xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1
                ${mode === 'play' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-700 hover:bg-blue-50'}`}
                >
                    Play Mode
                </button>
                <button
                    onClick={handleTeacherModeButtonClick}
                    className={`py-3 px-6 rounded-lg font-bold text-xl shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1
                ${mode === 'teacher' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-purple-700 hover:bg-purple-50'}`}
                >
                    Teacher Mode
                </button>
                {/* Help Icon - moved here */}
                <button
                    onClick={() => setShowHelpModal(true)}
                    className="ml-4 bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
                    aria-label="Help"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>

            {mode === 'play' ? (
                <WordPlayMode words={words} />
            ) : (
                <WordTeacherMode words={words} setWords={setWords} showAlert={showAlert} showConfirm={showConfirm} />
            )}

            {/* Set PIN Modal */}
            {showSetPinModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Set Teacher PIN</h3>
                        <p className="text-gray-600 mb-4 text-center">This PIN will be required to access Teacher Mode from Play Mode.</p>
                        <form onSubmit={handleSetPinSubmit}>
                            <input
                                type="password"
                                value={setPinInput}
                                onChange={(e) => setSetPinInput(e.target.value)}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-4"
                                placeholder="Enter new PIN"
                                autoFocus
                            />
                            {setPinError && <p className="text-red-500 text-sm mb-4 text-center">{setPinError}</p>}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleSetPinCancel}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                >
                                    Set PIN & Play
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Validate PIN Modal */}
            {showValidatePinModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Enter Teacher PIN</h3>
                        <form onSubmit={handleValidatePinSubmit}>
                            <input
                                type="password"
                                value={validatePinInput}
                                onChange={(e) => setValidatePinInput(e.target.value)}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mb-4"
                                placeholder="Enter PIN"
                                autoFocus
                            />
                            {validatePinError && <p className="text-red-500 text-sm mb-4 text-center">{validatePinError}</p>}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleValidatePinCancel}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Show help modal if  */}
            {showHelpModal && <WordHelpModal onClose={() => setShowHelpModal(false)} />}

            {/* Custom Alert Modal */}
            {showAlertModal && <AlertDialog message={alertMessage} onClose={() => setShowAlertModal(false)} />}

            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <ConfirmationModal
                    message={confirmMessage}
                    onConfirm={() => {
                        if (confirmActionRef.current) {
                            confirmActionRef.current.onConfirm();
                        }
                        setShowConfirmModal(false);
                    }}
                    onCancel={() => {
                        if (confirmActionRef.current) {
                            confirmActionRef.current.onCancel();
                        }
                        setShowConfirmModal(false);
                    }}
                />
            )}

        </div>
    );
}


export default WordGame;