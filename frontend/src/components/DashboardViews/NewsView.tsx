import React from "react";

export default function NewsView() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">News & Updates</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            News feed coming soon!
          </p>
          <p className="text-gray-500 mt-4">
            Stay updated with the latest announcements and features.
          </p>
        </div>
      </div>
    </div>
  );
}
