import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-900 text-white">
      <Navbar />
      <div className="text-center min-w-[80%] xl:min-w-[50%] p-10 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-7xl xl:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-teal-300 text-transparent bg-clip-text">
          Welcome to LearnMeet
        </h1>

        <p className="text-2xl xl:text-xl text-gray-300 mb-8">
          Meet, connect and learn together!
        </p>

        <nav>
          <Link
            to="/game"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold text-3xl xl:text-lg rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
          >
            Play Now
          </Link>
        </nav>
      </div>
    </main>
  );
}

export default Home;
