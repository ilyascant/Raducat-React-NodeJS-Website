// Confetti.js
import React, { useEffect, useState } from "react";

const Confetti = () => {
  const [confetti, setConfetti] = useState([]);

  const handleAnimationEnd = (id) => {
    setConfetti((prevConfetti) => prevConfetti.filter((confetto) => confetto.id !== id));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setConfetti((prevConfetti) => [
        ...prevConfetti,
        { id: Date.now(), left: Math.random() * 100, animationDuration: Math.random() * 3 + 2, rotation: Math.random() * 360 },
      ]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none overflow-hidden">
      {confetti.map((confetto) => (
        <span
          key={confetto.id}
          className="confetti-piece absolute text-3xl opacity-0"
          role="img"
          aria-label="confetti-piece"
          style={{ left: `${confetto.left}%`, animationDuration: `${confetto.animationDuration}s`, transform: `rotate(${confetto.rotation}deg)` }}
          onAnimationEnd={() => handleAnimationEnd(confetto.id)}>
          🎉
        </span>
      ))}
    </div>
  );
};

export default Confetti;
