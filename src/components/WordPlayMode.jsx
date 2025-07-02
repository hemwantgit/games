import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { shuffleArray } from '../utils/utils';
/**
 * PlayMode Component: The word guessing game.
 * @param {object} props
 * @param {Array<object>} props.words - Array of word objects {word: string, meaning: string}
 */
const WordPlayMode = ({ words }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffledWordIndices, setShuffledWordIndices] = useState([]); // Array of original indices in shuffled order
  const [currentWordIndexInShuffled, setCurrentWordIndexInShuffled] = useState(0); // Index within the shuffled array
  const [currentGuessPosition, setCurrentGuessPosition] = useState(0); // Tracks the index of the letter to guess in current word
  const [errorCount, setErrorCount] = useState(0); // Errors for the current word
  const [message, setMessage] = useState('');
  const [revealed, setRevealed] = useState(true); // Initially true to show the word
  const [sessionScore, setSessionScore] = useState(0); // Number of words correctly guessed in the session
  const [totalSessionErrors, setTotalSessionErrors] = useState(0); // Total errors across all words in the session
  const [isSessionOver, setIsSessionOver] = useState(false); // True when all words are guessed or max errors hit
  const [timeElapsed, setTimeElapsed] = useState(0); // Time elapsed for the current word
  const timerIntervalRef = useRef(null); // Ref to store the interval ID

  const MAX_ERRORS = 5;

  // Tone.js synths using useRef to persist across renders
  const applauseSynth = useRef(null);
  const bellSynth = useRef(null);
  const carSynth = useRef(null);
  const duckSynth = useRef(null);
  const beepSynth = useRef(null);

  // Initialize Tone.js synths once on component mount
  useEffect(() => {
    // Basic NoiseSynth for applause-like effect
    applauseSynth.current = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.5 }
    }).toDestination();

    // MetalSynth for bell sound
    bellSynth.current = new Tone.MetalSynth({
      frequency: 200,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.2 },
      harmonicity: 3.1,
      modulationIndex: 23,
      resonance: 8000,
      octaves: 1.5
    }).toDestination();

    // Simple Synth for car-like sound (low frequency, short attack/decay)
    carSynth.current = new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 0.3 },
      volume: -10
    }).toDestination();

    // AMSynth for duck-like quack
    duckSynth.current = new Tone.AMSynth({
      oscillator: { type: "square" },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.2 },
      harmonicity: 0.5,
      modulationIndex: 4,
      volume: -5
    }).toDestination();

    // Simple Synth for a short beep sound
    beepSynth.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
      volume: -10
    }).toDestination();
    // Cleanup synths on unmount
    return () => {
      applauseSynth.current.dispose();
      bellSynth.current.dispose();
      carSynth.current.dispose();
      duckSynth.current.dispose();
      beepSynth.current.dispose();
    };
  }, []);

  // Functions to play sounds, ensuring Tone.start() is called on user interaction
  const playApplause = useCallback(async () => { await Tone.start(); applauseSynth.current.triggerAttackRelease("1n"); }, []);
  const playBell = useCallback(async () => { await Tone.start(); bellSynth.current.triggerAttackRelease("C4", "8n"); }, []);
  const playCar = useCallback(async () => { await Tone.start(); carSynth.current.triggerAttackRelease("C2", "0.5"); }, []);
  const playDuck = useCallback(async () => { await Tone.start(); duckSynth.current.triggerAttackRelease("G2", "0.2"); }, []);
  const playBeep = useCallback(async () => { await Tone.start(); beepSynth.current.triggerAttackRelease("C5", "16n"); }, []); // Play a short beep


  // Helper to find the first non-space index in a word
  const findFirstNonSpaceIndex = (word) => {
    let index = 0;
    while (index < word.length && word[index] === ' ') {
      index++;
    }
    return index;
  };

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Determines the color of the placeholder based on error count.
   * @returns {string} Tailwind CSS class for text color.
   */
  const getPlaceholderColorClass = () => {
    if (errorCount === 0) return 'text-gray-700';
    if (errorCount < MAX_ERRORS) return 'text-orange-500';
    return 'text-red-600';
  };

  // Reset game state for a new session
  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setErrorCount(0); // Errors for current word
    setMessage('');
    setRevealed(true); // Show words initially
    setSessionScore(0); // Reset session score
    setTotalSessionErrors(0); // Reset total session errors
    setIsSessionOver(false); // Reset session over flag
    setTimeElapsed(0); // Reset timer

    // Clear any running timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (words.length > 0) {
      const initialIndices = Array.from({ length: words.length }, (_, i) => i);
      const shuffled = shuffleArray(initialIndices);
      setShuffledWordIndices(shuffled);
      setCurrentWordIndexInShuffled(0); // Start with the first word in the shuffled list
      const wordToGuess = words[shuffled[0]].word.toLowerCase();
      setCurrentGuessPosition(findFirstNonSpaceIndex(wordToGuess));
    } else {
      setMessage('No words available. Please add words in Teacher Mode.');
      setShuffledWordIndices([]);
      setCurrentWordIndexInShuffled(0);
      setCurrentGuessPosition(0);
    }
  }, [words]);

  // Effect to reset game when words change or component mounts
  useEffect(() => {
    resetGame();
  }, [words, resetGame]);

  // Timer effect
  useEffect(() => {
    if (isPlaying && !isSessionOver) {
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    // Cleanup on unmount or when dependencies change
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isPlaying, isSessionOver]);


  // Determine the current word and meaning from the shuffled list
  const currentWord = words[shuffledWordIndices[currentWordIndexInShuffled]]?.word.toLowerCase() || '';
  const currentMeaning = words[shuffledWordIndices[currentWordIndexInShuffled]]?.meaning || '';

  /**
   * Generates the placeholder display for the current word based on currentGuessPosition.
   * @returns {string} The word with guessed letters revealed and others as underscores.
   */
  const getDisplayWord = () => {
    if (revealed) {
      return currentWord; // Show full word if not playing yet
    }
    let display = '';
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] === ' ') {
        display += '\u00A0'; // Non-breaking space for actual spaces
      } else if (i < currentGuessPosition) {
        display += currentWord[i];
      } else {
        display += '_';
      }
    }
    return display.split('').join(' '); // Add spaces between characters for visual separation
  };

  /**
   * Handles an alphabet button click or keyboard input, checking if it matches the next expected letter.
   * @param {string} letter - The letter clicked/typed.
   */
  const handleGuess = (letter) => {
    if (!isPlaying || isSessionOver) { // Check if session is already over
      return;
    }

    const lowerCaseLetter = letter.toLowerCase();
    let nextExpectedCharIndex = currentGuessPosition;

    // Advance nextExpectedCharIndex past any spaces to find the actual character to guess
    while (nextExpectedCharIndex < currentWord.length && currentWord[nextExpectedCharIndex] === ' ') {
      nextExpectedCharIndex++;
    }

    // If we've reached the end of the word after skipping spaces, it means the word is complete
    if (nextExpectedCharIndex >= currentWord.length) {
      setMessage(`Word already completed! Click Play Again.`);
      setIsPlaying(false);
      setIsSessionOver(true); // End session if somehow reached here
      return;
    }

    const expectedLetter = currentWord[nextExpectedCharIndex];

    if (lowerCaseLetter === expectedLetter) {
      // Correct guess, advance position
      let newPos = currentGuessPosition;
      newPos++;
      while (newPos < currentWord.length && currentWord[newPos] === ' ') {
        newPos++;
      }

      setCurrentGuessPosition(newPos);
      setMessage(`Correct! Guess the next letter.`);

      // Check for word completion
      if (newPos >= currentWord.length) {
        setSessionScore(prev => prev + 1); // Increment score for correctly guessed word
        setMessage(`Congratulations! You guessed "${currentWord.toUpperCase()}" correctly!`);
        setErrorCount(0); // Reset errors for the current word (important for next word)
        setTimeElapsed(0); // Reset timer for the new word

        // Clear timer for current word
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

        // Move to next word in shuffled list or end session
        if (currentWordIndexInShuffled + 1 < shuffledWordIndices.length) {
          setTimeout(() => { // Give a moment to see the "correct" message
            const nextWordIdx = currentWordIndexInShuffled + 1;
            setCurrentWordIndexInShuffled(nextWordIdx);
            const nextWordToGuess = words[shuffledWordIndices[nextWordIdx]].word.toLowerCase();
            setCurrentGuessPosition(findFirstNonSpaceIndex(nextWordToGuess));
            setRevealed(true); // Show next word briefly
            setIsPlaying(false); // Pause game until "I'm Ready" for next word
            setMessage(`Next word: "${words[shuffledWordIndices[nextWordIdx]].meaning}"`);
          }, 1000); // 1 second delay
        } else {
          // All words exhausted, end session
          setIsPlaying(false);
          setIsSessionOver(true);
          playApplause(); // Play applause for session completion
        }
      }
    } else {
      playBeep(); // Play a short beep sound for incorrect guess
      // Incorrect guess
      setErrorCount(prev => {
        const newErrorCount = prev + 1;
        setTotalSessionErrors(prevTotal => prevTotal + 1); // Increment total session errors
        if (newErrorCount >= MAX_ERRORS) {
          setMessage(`Game Over! The word was "${currentWord.toUpperCase()}".`);
          setIsPlaying(false);
          setIsSessionOver(true); // Game over for the session due to max errors on current word
          playDuck(); // Play duck sound for game over
        } else {
          setMessage(`Oops! "${letter.toUpperCase()}" is not the correct letter for this position. Errors: ${newErrorCount}/${MAX_ERRORS}`);
        }
        return newErrorCount;
      });
    }
  };

  /**
   * Starts the game by hiding the full word and showing placeholders.
   */
  const handleReady = async () => {
    // Ensure Tone.js audio context is started on user interaction
    await Tone.start();

    if (words.length === 0) {
      setMessage('No words to play with. Please add words in Teacher Mode.');
      return;
    }
    setRevealed(false); // Hide the word
    setIsPlaying(true);
    setErrorCount(0);
    // Ensure currentGuessPosition starts at the first non-space character for the current word
    setCurrentGuessPosition(findFirstNonSpaceIndex(currentWord));
    setMessage('Guess the first letter!');
  };


  // Keyboard input handler
  const handleKeyDown = useCallback((event) => {
    // Only process if game is playing and session is not over
    if (isPlaying && !isSessionOver) {
      const key = event.key.toLowerCase();
      // Check if the key is a single alphabet character
      if (key.length === 1 && key >= 'a' && key <= 'z') {
        handleGuess(key);
      }
    }
  }, [isPlaying, isSessionOver, handleGuess]); // Dependencies for useCallback

  // Add and remove keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Play sound based on total errors at the end of the session
  useEffect(() => {
    if (isSessionOver && words.length > 0) {
      if (totalSessionErrors === 0 && sessionScore === words.length) {
        playApplause();
      } else if (totalSessionErrors >= 1 && totalSessionErrors <= 2 && sessionScore === words.length) {
        playBell();
      } else if (totalSessionErrors >= 3 && totalSessionErrors <= 4 && sessionScore === words.length) {
        playCar();
      } else {
        playDuck();
      }
    }
  }, [isSessionOver, totalSessionErrors, sessionScore, words.length, playApplause, playBell, playCar, playDuck]);


  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Play Mode</h2>

      {words.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No words available. Please add words in Teacher Mode to play.</p>
      ) : (
        <>
          {!isSessionOver && ( // Only show game elements if session is not over
            <>
              {/* Timer display */}
              <div className="text-2xl font-bold text-gray-800 mb-4">
                Time: <span className="text-blue-600">{formatTime(timeElapsed)}</span>
              </div>

              {/* Word/Placeholder displayed first */}
              <div className={`text-5xl font-extrabold tracking-widest mb-4 p-4 rounded-lg ${getPlaceholderColorClass()} transition-colors duration-300`}>
                {getDisplayWord().split('').map((char, index) => (
                  <span key={index} className="inline-block mx-1">
                    {char === ' ' ? '\u00A0' : char} {/* Non-breaking space for actual spaces */}
                  </span>
                ))}
              </div>

              {/* Meaning displayed second */}
              <div className="mb-6 text-center">
                <p className="text-xl font-semibold text-gray-700 mb-2">Meaning:</p>
                <p className="text-2xl text-blue-600 font-bold italic">{currentMeaning}</p>
              </div>


              {!isPlaying && ( // Only show "I'm Ready" if not playing and not session over
                <button
                  onClick={handleReady}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 mb-6 text-xl"
                >
                  I'm Ready!
                </button>
              )}

              {isPlaying ? (
                <>
                  {/* Error counter in red */}
                  <div className="text-lg font-medium mb-4 text-red-600">
                    Errors: <span className="font-bold">{errorCount}</span> / {MAX_ERRORS}
                  </div>
                  <p className={`text-xl font-semibold mb-6 ${message.includes('Correct') ? 'text-green-600' : message.includes('Oops') ? 'text-red-600' : 'text-gray-700'}`}>
                    {message}
                  </p>

                  <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-2 mb-6">
                    {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
                      <button
                        key={letter}
                        onClick={() => handleGuess(letter)}
                        disabled={errorCount >= MAX_ERRORS || !isPlaying} // Disable if max errors or not playing
                        className={`
                          w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-bold text-lg uppercase
                          ${errorCount >= MAX_ERRORS || !isPlaying
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5'
                          }
                        `}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}

          {isSessionOver && (
            <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Game Session Over!</h3>
              <p className="text-xl text-gray-700 mb-2">Words Guessed: <span className="font-bold text-green-600">{sessionScore}</span> / {words.length}</p>
              <p className="text-xl text-gray-700 mb-4">Total Errors: <span className="font-bold text-red-600">{totalSessionErrors}</span></p>
              {totalSessionErrors === 0 && sessionScore === words.length ? (
                <p className="text-2xl font-extrabold text-green-700 mb-4">Excellent!</p>
              ) : totalSessionErrors >= 1 && totalSessionErrors <= 2 && sessionScore === words.length ? (
                <p className="text-2xl font-extrabold text-blue-700 mb-4">Good!</p>
              ) : totalSessionErrors >= 3 && totalSessionErrors <= 4 && sessionScore === words.length ? (
                <p className="text-2xl font-extrabold text-orange-700 mb-4">Average!</p>
              ) : (
                <p className="text-2xl font-extrabold text-red-700 mb-4">Bad!</p>
              )}
              <button
                onClick={resetGame}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 text-xl mt-4"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WordPlayMode;