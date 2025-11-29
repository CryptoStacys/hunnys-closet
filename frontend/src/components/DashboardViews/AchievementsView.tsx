import React from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";

export default function AchievementsView() {
  const [user] = useAtom(userAtom);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">Achievements</h1>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your Progress
            </h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-600">
                  {user?.cupcake_points || 0}
                </p>
                <p className="text-sm text-gray-600">Cupcake Points</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {user?.level || 1}
                </p>
                <p className="text-sm text-gray-600">Level</p>
              </div>
            </div>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Achievement tracking coming soon!
            </p>
            <p className="text-gray-500 mt-4">
              Complete challenges and earn rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
