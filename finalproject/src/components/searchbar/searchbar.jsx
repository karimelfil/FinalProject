import React, { useRef } from "react";
import styles from "./searchbar.module.scss";
import { FaSearch } from "react-icons/fa";

export default function AnimatedSearchBar({ value, onChange }) {
  const inputRef = useRef(); //  used to directly reference the input element so we can manually focus it later

  return (
<div className={styles.searchSection}>




  <div className={styles.searchBox}>
    <div className={styles.inputContainer}>
      <FaSearch className={styles.searchIcon} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by name..."
        className={styles.input}
      />
      {value && (
        <button
          type="reset"
          aria-label="Clear"
          className={styles.resetBtn}
          onClick={() => {
            onChange?.({ target: { value: "" } }); // clears the input
            inputRef.current?.focus();
          }}
        >
          &times;
        </button>
      )}
    </div>
  </div>
</div>
  );
}