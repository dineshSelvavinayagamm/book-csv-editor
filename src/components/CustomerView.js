'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCustomer, deleteCustomer } from '@/slices/customerSlice';

export default function CustomerView() {
  const customers = useSelector((state) => state.customers);
  // READ → fetch customers from Redux store

  const dispatch = useDispatch();

  const [editIndex, setEditIndex] = useState(null);
  // Stores which row is being edited

  const [editValue, setEditValue] = useState('');
  // Stores edited customer value

  const startEdit = (index, value) => {
    // Initializes edit mode

    setEditIndex(index);
    setEditValue(value);
  };

  const saveEdit = () => {
    // Sends updated value to Redux

    dispatch(
      updateCustomer({
        index: editIndex,
        value: editValue,
      }),
    );

    setEditIndex(null);
  };

  const removeCustomer = (index) => {
    // DELETE operation

    dispatch(deleteCustomer(index));
  };

  return (
    <div>
      <h3>Customer List</h3>

      {customers.length === 0 ? (
        <p>No customers added</p>
      ) : (
        <ul className="space-y-1">
          {customers.map((customer, index) => (
            <li key={index}>
              {editIndex === index ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-400 px-2 py-1 rounded"
                  />

                  <button
                    onClick={saveEdit}
                    className="
        ml-2 px-2 py-1
        bg-green-600 text-white
        rounded-md
        text-sm font-medium
        hover:bg-green-700
        active:scale-95
        transition
      "
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{customer}</span>

                  <button
                    onClick={() => startEdit(index, customer)}
                    className="
        ml-2 px-2 py-1
        bg-blue-600 text-white
        rounded-md
        text-sm font-medium
        hover:bg-blue-700
        active:scale-95
        transition
      "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeCustomer(index)}
                    className="
        ml-2 px-2 py-1
        bg-red-600 text-white
        rounded-md
        text-sm font-medium
        hover:bg-red-700
        active:scale-95
        transition
      "
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
