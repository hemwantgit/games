
const WordHelpModal = ({ onClose }) => {

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => onClose()} >
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
             onClick={(e) => e.stopPropagation()} >
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">How to Play & Use</h3>
                <div className="text-gray-700 space-y-4 mb-6">
                    <p>Welcome to the Word Memorizer game! This app helps your child learn and remember new words through an interactive guessing game.</p>

                    <h4 className="text-xl font-semibold text-gray-800">Teacher Mode:</h4>
                    <p>In Teacher Mode, you can manage the word list:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>**Single Word Input:** Add new words and their meanings one by one.</li>
                        <li>**Bulk Input:** Paste multiple words at once. Each word and its meaning should be on a new line, separated by a colon (e.g., `apple: a common fruit`).</li>
                        <li>**Random Words:** Click this button to reveal a dropdown to select a difficulty level and an "Add Random Words" button. This will add up to 10 random words based on the selected difficulty.</li>
                        <li>You can also edit or delete existing words from the list.</li>
                        <li>When you switch from Teacher Mode to Play Mode for the first time, you'll be asked to set a temporary PIN. This PIN will be required to re-enter Teacher Mode from Play Mode.</li>
                    </ul>

                    <h4 className="text-xl font-semibold text-gray-800">Play Mode:</h4>
                    <p>In Play Mode, your child will guess words based on their meanings:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>The game will present a word's meaning, and your child needs to guess the word letter by letter.</li>
                        <li>**Sequential Guessing:** Letters must be entered in order from left to right.</li>
                        <li>**Keyboard Support:** Your child can type letters using the keyboard or click the on-screen alphabet buttons.</li>
                        <li>**Error Tracking:** An error counter (in red) tracks incorrect guesses for the current word. If 5 errors are made, the word is revealed, and the game moves to the next word.</li>
                        <li>**Timer:** A timer shows how long it takes to guess each word.</li>
                        <li>**Session Score:** At the end of the session (when all words are guessed or too many errors accumulate), a summary of words guessed and total errors will be shown, along with a performance rating and a sound effect:
                            <ul className="list-disc list-inside ml-8">
                                <li>**Excellent!** (0 total errors)</li>
                                <li>**Good!** (1-2 total errors)</li>
                                <li>**Average!** (3-4 total errors)</li>
                                <li>**Bad!** (5+ total errors)</li>
                            </ul>
                        </li>
                    </ul>

                    {/* <h4 className="text-xl font-semibold text-gray-800">Game Demo:</h4>
                    <p>Below is a demonstration of the game's functionality.</p> */}
                </div>

                {/* Game Demo GIF */}
                {/* <div className="flex justify-center mb-6">
                    <img
                        src="https://media.giphy.com/media/l0HlFZ3c4Ngi2fJgqZ/giphy.gif"
                        alt="Game Demo GIF"
                        className="rounded-lg shadow-md"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E7FF/4338CA?text=Image+Not+Found"; }}
                    />
                </div> */}

                <div className="flex justify-center">
                    <button
                        onClick={() => onClose()}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
                    >
                        Got It!
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WordHelpModal;