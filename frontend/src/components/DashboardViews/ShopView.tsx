import React from "react";

export default function ShopView() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">Shop</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            Shop features coming soon!
          </p>
          <p className="text-gray-500 mt-4">
            Browse and purchase items for your collection.
          </p>
        </div>
      </div>
    </div>
  );
}
