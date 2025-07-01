import { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.scss';
import { FiSun, FiMoon } from 'react-icons/fi';

function ThemeToggle() {
    // state variable to track whether dark mode is currently active
      // initial state is false light mode by default
  const [darkMode, setDarkMode] = useState(false);


  //initialize the theme based on localStorage
  useEffect(() => {
    // retrieve the stored theme preference from localStorage
    const storedTheme = localStorage.getItem('theme');
       // check if a theme preference was found and if it's dark
    if (storedTheme === 'dark') {
      setDarkMode(true); // set darkMode state to true
      document.documentElement.setAttribute('data-theme', 'dark');  // apply the dark data-theme attribute to the root HTML element
    } else {
      setDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);


  //update the document's theme attribute and localStorage whenever darkMode state changes
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
        // store the current theme preference in localStorage for persistence across sessions
    localStorage.setItem('theme', theme);
  }, [darkMode]);

  return (
    <button 
      onClick={() => setDarkMode(prev => !prev)}
      className={styles.toggleButton}
      aria-label="Toggle dark mode"
    >
      {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};

export default ThemeToggle;
