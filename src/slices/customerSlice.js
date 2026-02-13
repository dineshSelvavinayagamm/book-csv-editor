import { createSlice } from '@reduxjs/toolkit';

const initialState = [];
// Stores all customers as an array

const customerSlicer = createSlice({
  name: 'customer',
  initialState,

  reducers: {
    addCustomer(state, action) {
      // CREATE → add new customer
      state.push(action.payload);
    },

    updateCustomer(state, action) {
      // UPDATE → modify existing customer
      const { index, value } = action.payload;

      if (state[index] !== undefined) {
        state[index] = value;
      }
    },

    deleteCustomer(state, action) {
      // DELETE → remove customer by index
      state.splice(action.payload, 1);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customerSlicer.actions;

export default customerSlicer.reducer;
