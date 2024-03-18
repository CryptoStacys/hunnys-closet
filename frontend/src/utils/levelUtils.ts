export const pointsForLevels = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250, 3850, 4500, 5200, 5950, 6750, 7600, 8500, 9450, 10450, 11500];

export const calculateLevel = (cupcakePoints: number): number => {
  return pointsForLevels.findIndex((points, index) => cupcakePoints < points && index > 0) - 1;
};

export const calculateNextLevelPoints = (level: number): number => {
  return pointsForLevels[level + 1] || pointsForLevels[pointsForLevels.length - 1] + 150;
};

export const calculatePointsToNextLevel = (level: number, cupcakePoints: number): { currentLevelPoints: number, nextLevelPoints: number, earnedPointsThisLevel: number } => {
    const currentLevelPoints = pointsForLevels[level];
    const nextLevelPoints = calculateNextLevelPoints(level);
    const earnedPointsThisLevel = cupcakePoints - currentLevelPoints;
    return { currentLevelPoints, nextLevelPoints, earnedPointsThisLevel };
  };
  
