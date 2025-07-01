import styles from './Navbar.module.scss';
import ThemeToggle from '../themetoggle/ThemeToggle';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import ContactsIcon from '@mui/icons-material/Contacts';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
// state to control the open/close status of the mobile off-canvas menu
  const [isOpen, setIsOpen] = useState(false);

//toggle the state of the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.logoSection}>
          <img src="/logo.png" alt="Company Logo" className={styles.logoImage} />
          <h1 className={styles.websiteTitle}>ProdX</h1>
        </div>



        <nav className={styles.navLinks}>
          {/* nav bar links  */}
          <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.navbarLink}> Product</NavLink>
          <NavLink to="/contactus" className={({ isActive }) => isActive ? styles.activeLink : styles.navbarLink}>Contact</NavLink>
        </nav>

        <div className={styles.mobileHeaderControls}>
          {/* toggleTheme button  */}
          <ThemeToggle /> 

          {/* hamburger menu icon, displayed only when the off-canvas menu is closed */}


          {!isOpen && (
            <div className={styles.hamburgerMenu} onClick={toggleMenu}>
              <MenuIcon   sx={{color:'var(--menu-icon-color)'}} />
            </div>
          )}


        </div>

<div className={`${styles.offCanvasMenu} ${isOpen ? styles.open : ''}`}>
            {/* button to close the off-canvas menu */}
  <button className={styles.closeButton} onClick={toggleMenu}>
    &times;
  </button>
  <NavLink
    to="/"
    className={({ isActive }) => isActive ? styles.activeLink : styles.navbarLink}
    onClick={() => setIsOpen(false)}
  >
       <InventoryIcon/>  Product
  </NavLink>
  <NavLink
    to="/contactus"
    className={({ isActive }) => isActive ? styles.activeLink : styles.navbarLink}
    onClick={() => setIsOpen(false)} // close the menu when the link is clicked 
  >
      <ContactsIcon/>     Contact
  </NavLink>
</div>

        {/* icons on the right side of the navigation bar for larger screens */}
        <div className={styles.rightNavIcons}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Navbar;