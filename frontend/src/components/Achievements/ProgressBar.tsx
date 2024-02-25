import React, { useState, useEffect, useRef } from 'react';

interface ProgressBarProps {
  level: any;
  cupcakePoints: any;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ level, cupcakePoints }) => {
  const pointsForNextLevel = 100;
  const cappedCupcakePoints = cupcakePoints % pointsForNextLevel;
  const fillPercentage = (cappedCupcakePoints / pointsForNextLevel) * 100;

  const [animateToEnd, setAnimateToEnd] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const prevCupcakePoints = useRef(cupcakePoints);

  // Determine if a level up occurred
  useEffect(() => {
    if (Math.floor(prevCupcakePoints.current / pointsForNextLevel) < Math.floor(cupcakePoints / pointsForNextLevel)) {
      // Level up occurred, animate to end then reset
      setAnimateToEnd(true);
      setTimeout(() => {
        setAnimateToEnd(false);
        setResetAnimation(true);
        setTimeout(() => setResetAnimation(false), 50); // Short timeout before resetting fill
      }, 3000); // Match the duration of the fill animation to 100%
    }
    prevCupcakePoints.current = cupcakePoints;
  }, [cupcakePoints]);

  // Generate the progress bar segments
  const totalIncrements = 10;
  const segments = Array.from({ length: totalIncrements }, (_, i) => (
    <div
      key={i}
      className={`segment ${i < Math.ceil(fillPercentage / 10) ? 'filled' : ''}`}
    />
  ));

  return (
    <div className="progress-bar-container">
      <div className="level">{level}</div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${animateToEnd ? 'to-end' : resetAnimation ? 'reset' : ''}`}
          style={{ width: animateToEnd ? '100%' : resetAnimation ? '0%' : `${fillPercentage}%` }}
        ></div>
        <div className="progress-bar-segments">
          {segments}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
