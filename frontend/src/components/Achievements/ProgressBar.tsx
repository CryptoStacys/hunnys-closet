interface ProgressBarProps {
    level: any;
    cupcakePoints: any;
  }

  const ProgressBar: React.FC<ProgressBarProps> = ({ level, cupcakePoints }) => {
    const totalIncrements = 10;
    const pointsPerIncrement = 10;
    const pointsForNextLevel = 100;
    const cappedCupcakePoints = cupcakePoints % pointsForNextLevel;
    const fillPercentage = (cappedCupcakePoints / pointsForNextLevel) * 100;
    // Ensure level and cupcakePoints are treated as numbers and handle potential NaN values
    const numericLevel = Number(level) || 0;
    const numericCupcakePoints = Number(cupcakePoints) || 0;
  
    // Calculate the number of filled increments
    const filledIncrements = Math.floor((numericCupcakePoints % pointsForNextLevel) / pointsPerIncrement);
  
    // Generate the progress bar segments
    const segments = Array.from({ length: totalIncrements }, (_, i) => (
      <div
        key={i}
        className={`segment ${i < filledIncrements ? 'filled' : ''}`}
      />
    ));
  
    return (
      <div className="progress-bar-container">
        <div className="level">{level}</div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${fillPercentage}%`, animation: `fillAnimation 3s` }}
          ></div> {/* Dynamically set width */}
        </div>
      </div>
    );
};
  
export default ProgressBar;
