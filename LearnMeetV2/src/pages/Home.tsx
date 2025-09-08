import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>This is a standard React component.</p>
      <nav>
        <Link to="/game">Go to the Game</Link>
      </nav>
    </div>
  );
}

export default Home;
