import React from "react";

function Game() {
  return (
    <div className="game-container" style={{ width: "100%", height: "100%" }}>
      <iframe
        src="/game.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Kaplay Game"
      />
    </div>
  );
}

export default Game;
