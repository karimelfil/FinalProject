import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const productSlice = createSlice({
    // each product will be saved with his name and an array of his informations
  name: 'products',
  initialState,
  reducers: {
    // add function
    addProduct: (state, action) => {
      const { name, ...rest } = action.payload;
      state[name] = rest;
    },
    // update function
    updateProduct: (state, action) => {
      const { name, ...rest } = action.payload;
      if (state[name]) state[name] = rest;
    },
    //delete function
    deleteProduct: (state, action) => {
      delete state[action.payload];
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
