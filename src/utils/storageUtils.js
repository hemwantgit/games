
// Utility function to load words from local storage
export const loadWords = () => {
  try {
    const storedWords = localStorage.getItem('words');
    return storedWords ? JSON.parse(storedWords) : [];
  } catch (error) {
    console.error("Failed to load words from local storage:", error);
    return [];
  }
};

// Utility function to save words to local storage
export const saveWords = (words) => {
  try {
    localStorage.setItem('words', JSON.stringify(words));
  } catch (error) {
    console.error("Failed to save words to local storage:", error);
  }
};

// Utility function to load the teacher PIN from local storage
export const loadTeacherPin = () => {
  try {
    return localStorage.getItem('teacherPin');
  } catch (error) {
    console.error("Failed to load teacher PIN from local storage:", error);
    return null;
  }
};

// Utility function to save the teacher PIN to local storage
export const saveTeacherPin = (pin) => {
  try {
    if (pin !== null) {
      localStorage.setItem('teacherPin', pin);
    } else {
      localStorage.removeItem('teacherPin');
    }
  } catch (error) {
    console.error("Failed to save teacher PIN to local storage:", error);
  }
};
