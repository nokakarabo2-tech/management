/**
 * storage.js
 * Saves and loads the student list using the browser's localStorage,
 * so records survive a page refresh. localStorage only stores strings,
 * so the array is converted with JSON.stringify / JSON.parse.
 */

export const STORAGE_KEY = 'sms-students';

/**
 * Loads students from localStorage.
 * Returns the fallback list when nothing is saved yet, or when the
 * saved data is unreadable (e.g. corrupted or storage is blocked).
 *
 * @param {Array<Object>} fallback - list to use if nothing valid is stored
 * @returns {Array<Object>}
 */
export function loadStudents(fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return fallback;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Saves the student list. Errors (e.g. private browsing / storage full)
 * are caught so the app keeps working with in-memory React state.
 *
 * @param {Array<Object>} students
 * @returns {boolean} true if saved successfully
 */
export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch {
    return false;
  }
}
