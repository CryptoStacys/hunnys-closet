import { User } from "../data/global";

// /utils/achievements.ts
interface Achievement {
    id: string;
    title: string;
    criteria: string;
    isAchieved: (user: User) => boolean;
  }
  
  export const achievements: Achievement[] = [
    {
      id: 'achievement_1',
      title: 'Noobie Boobie',
      criteria: 'Own 3 or more Dollys',
      isAchieved: (user) => user.dollys.length >= 3,
    },
    // Add more achievements as needed
  ];
  