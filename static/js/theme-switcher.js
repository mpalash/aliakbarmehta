// static/js/theme-switcher.js

/**
 * @constant {string} THEME_KEY - The key used to store the theme preference in localStorage.
 */
const THEME_KEY = 'theme-preference';

/**
 * Retrieves the user's theme preference from localStorage.
 * @returns {string|null} The stored theme preference ('dark', 'light'), or null if not set.
 */
function getThemePreference() {
  return localStorage.getItem(THEME_KEY);
}

/**
 * Saves the user's theme preference to localStorage.
 * @param {string} theme - The theme to save ('dark' or 'light').
 */
function setThemePreference(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Determines the system's preferred color scheme.
 * @returns {string} 'dark' if the system prefers a dark theme, otherwise 'light'.
 */
function getSystemPreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Applies the specified theme to the document and updates the switcher button's state.
 * @param {string} theme - The theme to apply ('dark' or 'light').
 */
function applyTheme(theme) {
  const htmlElement = document.documentElement;
  const themeSwitcherButton = document.getElementById('theme-switcher');

  if (theme === 'dark') {
    htmlElement.classList.add('dark-theme');
  } else {
    htmlElement.classList.remove('dark-theme');
  }

  if (themeSwitcherButton) {
    themeSwitcherButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    // You could also use a data attribute, e.g., themeSwitcherButton.dataset.theme = theme;
  }
}

/**
 * Toggles the theme between light and dark.
 * It considers existing preference, then current applied theme.
 * Saves the new preference.
 */
function toggleTheme() {
  let currentThemePreference = getThemePreference();
  let newTheme;

  if (currentThemePreference) {
    // If a preference is stored, switch to the opposite
    newTheme = currentThemePreference === 'dark' ? 'light' : 'dark';
  } else {
    // If no preference, check the currently applied theme (e.g., from system preference)
    // and switch to the opposite
    const isCurrentlyDark = document.documentElement.classList.contains('dark-theme');
    newTheme = isCurrentlyDark ? 'light' : 'dark';
  }

  applyTheme(newTheme);
  setThemePreference(newTheme);
}

/**
 * IIFE to apply the initial theme on page load.
 * It prioritizes user preference, then system preference.
 */
(function initializeTheme() {
  const userPreference = getThemePreference();
  if (userPreference) {
    applyTheme(userPreference);
  } else {
    const systemPreference = getSystemPreference();
    applyTheme(systemPreference);
    // Optionally, you might want to save this initial system-derived theme as a preference:
    // setThemePreference(systemPreference); 
    // However, the requirement was to only set preference on toggle/explicit set.
  }
})();

/**
 * Attaches event listener to the theme switcher button.
 */
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcherButton = document.getElementById('theme-switcher');
  if (themeSwitcherButton) {
    themeSwitcherButton.addEventListener('click', toggleTheme);
  } else {
    console.warn('Theme switcher button with id="theme-switcher" not found.');
  }
});
