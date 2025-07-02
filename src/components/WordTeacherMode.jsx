import React, { useState } from 'react';
import { getRandomWords} from '../utils/utils';
/**
 * TeacherMode Component: Allows adding, editing, and deleting words.
 * @param {object} props
 * @param {Array<object>} props.words - Array of word objects {word: string, meaning: string, difficulty: string}
 * @param {function(Array<object>): void} props.setWords - Function to update the words state
 * @param {function(string): void} props.showAlert - Function to show an alert modal.
 * @param {function(string, function, function): void} props.showConfirm - Function to show a confirmation modal.
 */
const WordTeacherMode = ({ words, setWords, showAlert, showConfirm }) => {
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [bulkInput, setBulkInput] = useState('');
  const [activeTab, setActiveTab] = useState('single'); // 'single', 'bulk', 'random'

  const [selectedJsonDifficulty, setSelectedJsonDifficulty] = useState('easy'); // For adding from JSON
  const [randomJsonWordsMessage, setRandomJsonWordsMessage] = useState('');


  /**
   * Handles adding a new word or updating an existing one.
   * @param {React.FormEvent} e - The form event.
   */
  const handleAddOrUpdateWord = (e) => {
    e.preventDefault();
    if (newWord.trim() === '' || newMeaning.trim() === '') {
      showAlert('Word and Meaning cannot be empty.');
      return;
    }

    // Words added manually default to 'Medium' difficulty
    const wordData = { word: newWord.trim(), meaning: newMeaning.trim(), difficulty: 'Medium' };

    if (editingIndex !== null) {
      // Update existing word
      const updatedWords = [...words];
      updatedWords[editingIndex] = wordData;
      setWords(updatedWords);
      setEditingIndex(null);
    } else {
      // Add new word
      setWords([...words, wordData]);
    }
    setNewWord('');
    setNewMeaning('');
    
  };

  /**
   * Handles adding multiple words from bulk input.
   * Format: word: meaning (difficulty is no longer an option in bulk input)
   * @param {React.FormEvent} e - The form event.
   */
  const handleAddBulkWords = (e) => {
    e.preventDefault();
    const lines = bulkInput.split('\n').filter(line => line.trim() !== '');
    const newWords = [];
    let hasError = false;

    lines.forEach(line => {
      const parts = line.split(':').map(part => part.trim());
      if (parts.length >= 2) {
        const word = parts[0];
        const meaning = parts[1];
        // Words added via bulk input default to 'Medium' difficulty
        const difficulty = 'Medium';

        if (word && meaning) {
          newWords.push({ word, meaning, difficulty });
        } else {
          hasError = true;
        }
      } else {
        hasError = true;
      }
    });

    if (hasError) {
      showAlert('Some lines were not in "word: meaning" format and were skipped.');
    }

    if (newWords.length > 0) {
      setWords(prevWords => [...prevWords, ...newWords]);
      setBulkInput('');
    } else if (!hasError) {
      showAlert('No valid words found in the bulk input.');
    }
  };

  /**
   * Adds 10 random words from the static JSON list based on selected difficulty.
   */
  const handleAddRandomJsonWords = () => {
    const filteredWords = getRandomWords(selectedJsonDifficulty);
    if (filteredWords.length === 0) {
      setRandomJsonWordsMessage(`No words found for "${selectedJsonDifficulty}" difficulty.`);
      setTimeout(() => setRandomJsonWordsMessage(''), 3000);
      return;
    }

    setWords(prevWords => [...prevWords, ...filteredWords]);
    setRandomJsonWordsMessage(`Added ${filteredWords.length} random words of "${selectedJsonDifficulty}".`);
    setTimeout(() => setRandomJsonWordsMessage(''), 3000);
  };

  /**
   * Sets the form fields for editing a word.
   * @param {number} index - The index of the word to edit.
   */
  const handleEdit = (index) => {
    setNewWord(words[index].word);
    setNewMeaning(words[index].meaning);
    setEditingIndex(index);
    setActiveTab('single'); // Switch to single input tab when editing
  };

  /**
   * Deletes a word from the list.
   * @param {number} index - The index of the word to delete.
   */
  const handleDelete = (index) => {
    showConfirm(
      'Are you sure you want to delete this word?',
      () => {
        const updatedWords = words.filter((_, i) => i !== index);
        setWords(updatedWords);
      },
      () => { /* Do nothing if cancelled */ }
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Teacher Mode</h2>

      <div className="flex justify-center space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('single')}
          className={`py-2 px-4 rounded-t-lg font-bold transition duration-200
            ${activeTab === 'single' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Single Word Input
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`py-2 px-4 rounded-t-lg font-bold transition duration-200
            ${activeTab === 'bulk' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Bulk Input
        </button>
        <button
          onClick={() => setActiveTab('random')}
          className={`py-2 px-4 rounded-t-lg font-bold transition duration-200
            ${activeTab === 'random' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Random Words
        </button>
      </div>

      {activeTab === 'single' && (
        <form onSubmit={handleAddOrUpdateWord} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="mb-4">
            <label htmlFor="word" className="block text-gray-700 text-sm font-semibold mb-2">Word:</label>
            <input
              type="text"
              id="word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter word"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="meaning" className="block text-gray-700 text-sm font-semibold mb-2">Meaning:</label>
            <input
              type="text"
              id="meaning"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter meaning"
            />
          </div>
          {/* Difficulty selection removed from single input */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            {editingIndex !== null ? 'Update Word' : 'Add Word'}
          </button>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={() => { setEditingIndex(null); setNewWord(''); setNewMeaning('');}}
              className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}

      {activeTab === 'bulk' && (
        <form onSubmit={handleAddBulkWords} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="mb-4">
            <label htmlFor="bulk-words" className="block text-gray-700 text-sm font-semibold mb-2">Enter words (one per line, format: word: meaning)</label>
            <textarea
              id="bulk-words"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows="8"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder={`Example:\napple: a common fruit\nbanana: a yellow fruit`}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Add Bulk Words
          </button>
        </form>
      )}

      {activeTab === 'random' && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Add 10 Random Words</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <div className="w-full sm:w-1/2">
              <label htmlFor="json-difficulty-select" className="block text-gray-700 text-sm font-semibold mb-2">Select Difficulty:</label>
              <select
                id="json-difficulty-select"
                value={selectedJsonDifficulty}
                onChange={(e) => setSelectedJsonDifficulty(e.target.value)}
                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
                <option value="advance">Advance</option>
              </select>
            </div>
            <button
              onClick={handleAddRandomJsonWords}
              className="w-full sm:w-auto mt-6 sm:mt-auto bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Add Random Words
            </button>
          </div>
          {randomJsonWordsMessage && (
            <p className="text-center text-sm text-gray-600 mt-2">{randomJsonWordsMessage}</p>
          )}
        </div>
      )}


      <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Your Words</h3>
      {words.length === 0 ? (
        <p className="text-center text-gray-500">No words added yet. Add some words above!</p>
      ) : (
        <ul className="space-y-4">
          {words.map((item, index) => (
            <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-100 rounded-lg shadow-sm">
              <div className="flex-1 mb-2 sm:mb-0">
                <p className="text-lg font-medium text-gray-900 capitalize">{item.word}: <span className="text-md text-gray-600 italic">{item.meaning}</span></p>
                <p className="text-sm text-gray-500">Difficulty: {item.difficulty}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WordTeacherMode;