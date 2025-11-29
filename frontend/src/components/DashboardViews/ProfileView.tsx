import React from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import { useAuth } from "../../hooks/useAuth";

export default function ProfileView() {
  const [user] = useAtom(userAtom);
  const { user: authUser } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">Profile</h1>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
              {user?.username?.charAt(0).toUpperCase() || authUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.profile_name || user?.username || authUser?.username || "User"}
              </h2>
              <p className="text-gray-600">{user?.email || authUser?.email}</p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Account Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tier</p>
                <p className="text-lg font-semibold text-pink-600">
                  {user?.tier || "Fresh Cupcake"}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-lg font-semibold text-purple-600">
                  {user?.level || 1}
                </p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cupcake Points</p>
                <p className="text-lg font-semibold text-pink-600">
                  {user?.cupcake_points || 0}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Dollys Created</p>
                <p className="text-lg font-semibold text-purple-600">
                  {user?.dollyCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Titles</h3>
            <div className="flex flex-wrap gap-2">
              {user?.titles && user.titles.length > 0 ? (
                user.titles.map((title, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm"
                  >
                    {title}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No titles yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
