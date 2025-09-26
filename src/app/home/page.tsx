'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/constants';
import { useAppHeader } from '../hooks/appHeader';
import { Phone, Mail, Link } from 'lucide-react';

const Home = () => {
  const { updateTitle } = useAppHeader();
  const router = useRouter();

  useEffect(() => {
    updateTitle(PageTitle.Home);
  }, [updateTitle]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">
        {/* Left Column: Welcome Card */}
        <div className="bg-white rounded-xl shadow-md p-8 flex-1 border border-slate-200 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Welcome to Notion Press Media Dashboard
          </h1>
          <button
            onClick={() => router.push('/csv')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Navigate to CSV Editor Tool"
          >
            Go to the Tool
          </button>
        </div>

        {/* Right Column: About Myself Card */}
        <div className="bg-white rounded-xl shadow-md p-8 flex-1 border border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center">
            About Myself
          </h2>
          <div className="text-sm sm:text-base text-gray-600 space-y-4">
            <p className="font-semibold text-center">Dinesh S</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="flex items-center gap-1">
                <Phone size={14} className="text-indigo-600" />
                +91 7550148148
              </span>
              <span className="flex items-center gap-1">
                <Mail size={14} className="text-indigo-600" />
                <a
                  href="mailto:dinesh.selvavinayagam.dev@gmail.com"
                  className="hover:text-indigo-700 transition"
                >
                  dinesh.selvavinayagam.dev@gmail.com
                </a>
              </span>
              <span className="flex items-center gap-1">
                <Link size={14} className="text-indigo-600" />
                <a
                  href="https://linkedin.com/in/dinesh-selvavinayagam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-700 transition"
                >
                  LinkedIn
                </a>
                /
                <a
                  href="https://naukri.com/dinesh-selvavinayagam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-700 transition"
                >
                  Naukri
                </a>
              </span>
            </div>
            <p className="text-center">Chennai, India</p>
            <p className="text-justify">
              Results-driven Front-End Developer with 3+ years of experience in building
              dynamic, scalable, and high-performance web applications. Skilled in
              React.js, Next.js, Material UI, Radix UI, ShadCN UI, and Tailwind CSS, with
              a deep understanding of modern UI/UX principles. Proficient in writing
              clean, maintainable code with Jest for testing and utilizing GitHub,
              Jenkins, and SonarQube for efficient CI/CD workflows. Adept at error
              debugging, performance optimization, and collaborating with cross-functional
              teams to deliver high-quality applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
