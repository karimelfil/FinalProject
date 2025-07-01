import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import { loadState, saveState } from '../utils/localstorage';

const persistedProducts = loadState();

export const store = configureStore({
  reducer: {
    products: (state = persistedProducts, action) => productReducer(state, action),
  },
  devTools: true,
});

// save products to localStorage on every state change
store.subscribe(() => {
  const state = store.getState();
  saveState(state.products);
});
