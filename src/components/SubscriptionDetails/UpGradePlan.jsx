"use client";
import React from "react";

export default function UpGradePlan() {
  const userEmail = "rakib@example.com"; // You can replace with session email

  const handleSelect = (plan) => {
    console.log("Selected Email:", userEmail);
    console.log("Selected Plan:", plan);
  };

  return (
    <div className="min-h-screen w-full bg-[#061228] flex justify-center items-center px-4 py-10">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Starter */}
        <div className="bg-[#071b3b] text-white rounded-2xl p-8 shadow-xl border border-[#0e2a59]">
          <h2 className="text-2xl font-semibold mb-3">Starter</h2>
          <p className="text-yellow-400 text-4xl font-bold">$15<span className="text-xl ml-1">/month</span></p>

          <ul className="mt-6 space-y-3 text-gray-300">
            <li className="flex gap-2">✔ Access our full database</li>
            <li className="flex gap-2">✔ Send 10 emails/day</li>
            <li className="flex gap-2">✔ Save up to three templates</li>
            <li className="flex gap-2">✔ Create personalized email templates</li>
          </ul>

          <button
            onClick={() => handleSelect("Starter")}
            className="mt-8 w-full py-3 rounded-xl bg-[#162b52] hover:bg-[#1e3a70] transition duration-300"
          >
            Get Started
          </button>

          <p className="mt-4 text-center text-gray-400 text-sm">Cancel anytime. No commitment.</p>
        </div>

        {/* Plus */}
        <div className="bg-[#071b3b] text-white rounded-2xl p-8 shadow-xl border border-yellow-400 relative">
          <div className="absolute inset-0 rounded-2xl border-2 border-yellow-500 pointer-events-none"></div>

          <h2 className="text-2xl font-semibold mb-3">Plus</h2>
          <p className="text-yellow-400 text-4xl font-bold">$20<span className="text-xl ml-1">/month</span></p>

          <ul className="mt-6 space-y-3 text-gray-300">
            <li className="flex gap-2">✔ Everything in Starter</li>
            <li className="flex gap-2">✔ Send 25 emails/day</li>
            <li className="flex gap-2">✔ Save up to five templates</li>
            <li className="flex gap-2">✔ See engagement scores for each email</li>
          </ul>

          <button
            onClick={() => handleSelect("Plus")}
            className="mt-8 w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition duration-300"
          >
            Boost Your Reach
          </button>

          <p className="mt-4 text-center text-gray-400 text-sm">Cancel anytime. No commitment.</p>
        </div>

        {/* Max */}
        <div className="bg-[#071b3b] text-white rounded-2xl p-8 shadow-xl border border-[#0e2a59]">
          <h2 className="text-2xl font-semibold mb-3">Max</h2>
          <p className="text-yellow-400 text-4xl font-bold">$30<span className="text-xl ml-1">/month</span></p>

          <ul className="mt-6 space-y-3 text-gray-300">
            <li className="flex gap-2">✔ Everything in Plus</li>
            <li className="flex gap-2">✔ Send 50 emails/day</li>
            <li className="flex gap-2">✔ Save up to 10 templates</li>
            <li className="flex gap-2">✔ Include attachments in your emails</li>
          </ul>

          <button
            onClick={() => handleSelect("Max")}
            className="mt-8 w-full py-3 rounded-xl bg-[#162b52] hover:bg-[#1e3a70] transition duration-300"
          >
            Max Out Exposure
          </button>

          <p className="mt-4 text-center text-gray-400 text-sm">Cancel anytime. No commitment.</p>
        </div>

      </div>
    </div>
  );
}
