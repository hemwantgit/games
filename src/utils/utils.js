import vocabularyData  from '../static/words';
/**
 * Fisher-Yates shuffle algorithm to randomize array order.
 * @param {Array<any>} array - The array to shuffle.
 * @returns {Array<any>} A new shuffled array.
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Global variable to store recently used words for each difficulty
const recentWordsHistory = {
  "easy": [],
  "normal": [],
  "medium": [],
  "hard": [],
  "expert": [],
  "advance": []
};

// Define the maximum size for the history of recently used words
const HISTORY_SIZE = 30; // Keeps track of the last 30 unique words shown per difficulty

/**
 * Displays 10 random words based on the selected difficulty,
 * prioritizing words not recently displayed.
 */
export function getRandomWords(selectedDifficulty, numWordsToDisplay = 10) {
  const allWordsForDifficulty = vocabularyData[selectedDifficulty];

  let wordsToShow = [];
  if (!allWordsForDifficulty || allWordsForDifficulty.length === 0) {
    console.warn(`No words available for difficulty: ${selectedDifficulty}`);
    return wordsToShow;
  }

  // Ensure history exists for the selected difficulty
  if (!recentWordsHistory[selectedDifficulty]) {
    recentWordsHistory[selectedDifficulty] = [];
  }
  let currentHistory = recentWordsHistory[selectedDifficulty];


  // 1. Prioritize words not in recent history
  // Filter out words whose 'word' property is present in currentHistory
  const freshWords = allWordsForDifficulty.filter(wordObj => !currentHistory.includes(wordObj.word));
  const shuffledFreshWords = shuffleArray([...freshWords]); // Shuffle a copy to avoid modifying original

  // Add fresh words until we have 10 or run out of fresh words
  for (let i = 0; i < shuffledFreshWords.length && wordsToShow.length < numWordsToDisplay; i++) {
    wordsToShow.push(shuffledFreshWords[i]);
  }

  // 2. If not enough words, supplement with words from the full list, avoiding those already selected
  if (wordsToShow.length < numWordsToDisplay) {
    const remainingCount = numWordsToDisplay - wordsToShow.length;
    const allWordsShuffled = shuffleArray([...allWordsForDifficulty]); // Shuffle a copy of all words

    let count = 0;
    for (const wordObj of allWordsShuffled) {
      // Only add if not already in wordsToShow (to prevent duplicates within the current display)
      // and not already in the recent history (to still prioritize less recent words if possible)
      if (!wordsToShow.some(w => w.word === wordObj.word) && !currentHistory.includes(wordObj.word)) {
        wordsToShow.push(wordObj);
        count++;
      }
      if (count >= remainingCount) {
        break;
      }
    }
  }

  // If still not enough words (e.g., total list is very small),
  // fill up the remaining spots from the full list, ensuring uniqueness within the 10 words.
  if (wordsToShow.length < numWordsToDisplay) {
    const finalRemaining = numWordsToDisplay - wordsToShow.length;
    const allWordsShuffled = shuffleArray([...allWordsForDifficulty]); // Re-shuffle all words

    let count = 0;
    for (const wordObj of allWordsShuffled) {
      if (!wordsToShow.some(w => w.word === wordObj.word)) {
        wordsToShow.push(wordObj);
        count++;
      }
      if (count >= finalRemaining) {
        break;
      }
    }
  }


  // Update history: add newly displayed words and trim if over size
  wordsToShow.forEach(wordObj => {
    // Remove the word from history if it's already there to move it to the front (most recent)
    const indexInHistory = currentHistory.indexOf(wordObj.word);
    if (indexInHistory > -1) {
      currentHistory.splice(indexInHistory, 1);
    }
    // Add the word to the beginning of the history
    currentHistory.unshift(wordObj.word);
  });

  // Trim history to the maximum size to keep it manageable
  recentWordsHistory[selectedDifficulty] = currentHistory.slice(0, HISTORY_SIZE);
  return wordsToShow;
}