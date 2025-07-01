export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('products');
    return serializedState ? JSON.parse(serializedState) : {};
  } catch (err) {
    console.error('Could not load state from localStorage', err);
    return {};
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('products', serializedState);
  } catch (err) {
    console.error('Could not save state to localStorage', err);
  }
};
