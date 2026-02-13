'use client';

import React, { useState } from 'react';
import { addCustomer } from '@/slices/customerSlice';
import { useDispatch } from 'react-redux';

export default function CustomerAdd() {
  const [input, setInput] = useState('');
  // Local form state

  const dispatch = useDispatch();
  // Used to send actions to Redux

  const handleAddCustomer = () => {
    if (input.trim()) {
      // Basic validation

      dispatch(addCustomer(input));
      // CREATE operation

      setInput('');
      // Reset form
    }
  };

  return (
    <div>
      <h3>Add New Customer</h3>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border border-gray-400 px-2 py-1 rounded focus:outline-none"
      />

      <button
        onClick={handleAddCustomer}
        className="
    px-2 py-1
    ml-2
    bg-indigo-600 text-white
    rounded-lg
    font-semibold
    hover:bg-indigo-700
    active:scale-95
    transition-all duration-150
    focus:ring-2 focus:ring-indigo-400
  "
      >
        Add
      </button>
    </div>
  );
}
