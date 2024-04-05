import React, { useState, useEffect, useRef } from 'react';

interface ProgressBarProps {
  level: any;
  cupcakePoints: any; // Now represents earned points this level
  maxPoints: number; // Points required to reach the next level
}

const ProgressBar: React.FC<ProgressBarProps> = ({ level, cupcakePoints, maxPoints }) => {
  const fillPercentage = (cupcakePoints / maxPoints) * 100; // Calculate the percentage of progress toward the next level
  
  const [animateToEnd, setAnimateToEnd] = useState(false);
  const [resetAnimation, setResetAnimation] = useState(false);
  const prevLevel = useRef(level);

  useEffect(() => {
    if (prevLevel.current < level) { // Detects level-up
      setAnimateToEnd(true);
      setTimeout(() => {
        setAnimateToEnd(false);
        setResetAnimation(true);
        setTimeout(() => setResetAnimation(false), 250); // Short timeout before resetting fill
      }, 1000); // Adjusted animation time for demonstration
    }
    prevLevel.current = level;
  }, [level]);

  const totalIncrements = 10;
  const segments = Array.from({ length: totalIncrements }, (_, i) => (
    <div key={i} className={`segment ${i < Math.ceil(fillPercentage / 10) ? 'filled' : ''}`}></div>
  ));

  return (
    <div className='flex flex-col'>
      
<div className='flex self-end xs:mr-0 sm:mr-6 md:mr-12 lg:mr-16 xs:top-4 relative xs:mt-[-60px] md:mt-[-32px]'>
      <img className='xs:w-[60%] sm:w-[80%]' src="/icons/Achievements/TreasureChest.png"></img>
    </div>
    <div className="progress-bar-container">
    
      <div className="level">{level}</div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${animateToEnd ? 'to-end' : resetAnimation ? 'reset' : ''}`}
          style={{ width: `${Math.min(fillPercentage, 100)}%` }}> {/* Ensure fill percentage does not exceed 100% */}
        </div>
        <div className="progress-bar-segments">{segments}</div>
      </div>
    </div>
    </div>
  );
};

export default ProgressBar;