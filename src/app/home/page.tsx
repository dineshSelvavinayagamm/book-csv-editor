'use client';
import { PageTitle } from '@/constants';
import React, { useEffect } from 'react';
import { useAppHeader } from '../hooks/appHeader';

const Home = () => {
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.Home);
  }, [updateTitle]);

  useEffect(() => {
    fetch('/books_large.csv')
      .then((res) => res.text())
      .then((csv) => {
        console.log('📚 Loaded CSV preview:', csv.slice(0, 300));
      })
      .catch((err) => {
        console.error('❌ Error loading CSV:', err);
      });
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Notion Press Media Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your account, view reports, and access resources.
        </p>
      </header>

      {/* Quick Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">1,245</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold">Active Subscriptions</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">874</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold">Pending Orders</h2>
          <p className="text-3xl font-bold mt-2 text-yellow-600">32</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-3xl font-bold mt-2 text-purple-600">$12,450</p>
        </div>
      </section>

      {/* Latest Activities */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Latest Activities</h2>
        <ul className="space-y-3">
          <li className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <span className="font-semibold">John Doe</span> created a new post.
            <span className="text-gray-500 ml-2">2 hours ago</span>
          </li>
          <li className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <span className="font-semibold">Alice Smith</span> updated her profile.
            <span className="text-gray-500 ml-2">5 hours ago</span>
          </li>
          <li className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <span className="font-semibold">Admin</span> approved a subscription.
            <span className="text-gray-500 ml-2">1 day ago</span>
          </li>
        </ul>
      </section>

      {/* Call-to-action */}
      <section className="mt-8 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 p-6 rounded-xl text-white text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Start Your Next Project</h2>
        <p className="mb-4">Manage your content and grow your audience efficiently.</p>
        <button className="px-6 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition">
          Create New
        </button>
      </section>
    </div>
  );
};

export default Home;
