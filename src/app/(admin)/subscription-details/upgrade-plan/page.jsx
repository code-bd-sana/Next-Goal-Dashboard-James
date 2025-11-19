"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useCreateSubscriptionMutation } from "@/feature/SubscriptionApi";
import { Hourglass } from "react-loader-spinner";

export default function UpGradePlan() {
  const userData = useSession();
  const data = userData?.data;

  if (userData?.status === "loading") {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#061228]">
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          colors={["#162042", "#FFD700"]}
        />
      </div>
    );
  }

  const userEmail = data?.user?.email;

  const [
    createSubscription,
    { isLoading, isError, error, isSuccess },
  ] = useCreateSubscriptionMutation();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Something went wrong!");
      console.log(error?.data?.message, "Backend Error");
    }
  }, [isError]);

  const handleSelect = async (plan) => {
    if (!userEmail) {
      toast.error("Please login first!");
      return;
    }

    console.log("Selected Email:", userEmail);
    console.log("Selected Plan:", plan);

    const planData = { email: userEmail, plan };

    try {
      const res = await createSubscription(planData).unwrap();
      console.log(res?.url, "Subscription URL");

      window.location.href = res.url; // Redirect to checkout
    } catch (err) {
      console.log("Request failed:", err);
    }
  };

  return (
    <>
      <Toaster />

      {/* 🌟 GLOBAL BEAUTIFUL LOADING MODAL */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-[#0b1a33] border border-yellow-400 rounded-2xl px-10 py-8 shadow-2xl text-center">
            <Hourglass
              visible={true}
              height="70"
              width="70"
              colors={["#FFD700", "#162042"]}
            />
            <p className="text-yellow-300 mt-4 text-lg font-semibold">
              Processing your subscription...
            </p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="min-h-screen w-full bg-[#061228] flex justify-center items-center px-4 py-10">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Starter */}
          <div className="bg-[#071b3b] text-white rounded-2xl p-8 shadow-xl border border-[#0e2a59]">
            <h2 className="text-2xl font-semibold mb-3">Starter</h2>
            <p className="text-yellow-400 text-4xl font-bold">
              $15<span className="text-xl ml-1">/month</span>
            </p>

            <ul className="mt-6 space-y-3 text-gray-300">
              <li>✔ Access our full database</li>
              <li>✔ Send 10 emails/day</li>
              <li>✔ Save up to three templates</li>
              <li>✔ Create personalized templates</li>
            </ul>

            <button
              onClick={() => handleSelect("Starter")}
              className="mt-8 w-full py-3 rounded-xl bg-[#162b52] hover:bg-[#1e3a70] transition duration-300"
            >
              Get Started
            </button>

            <p className="mt-4 text-center text-gray-400 text-sm">
              Cancel anytime. No commitment.
            </p>
          </div>

          {/* Plus */}
          <div className="bg-[#071b3b] text-white rounded-2xl p-8 shadow-xl border border-yellow-400 relative">
            <div className="absolute inset-0 rounded-2xl border-2 border-yellow-500 pointer-events-none"></div>

            <h2 className="text-2xl font-semibold mb-3">Plus</h2>
            <p className="text-yellow-400 text-4xl font-bold">
              $20<span className="text-xl ml-1">/month</span>
            </p>

            <ul className="mt-6 space-y-3 text-gray-300">
              <li>✔ Everything in Starter</li>
              <li>✔ Send 25 emails/day</li>
              <li>✔ Save five templates</li>
              <li>✔ Engagement scores</li>
            </ul>

            <button
              onClick={() => handleSelect("Plus")}
              className="mt-8 w-full py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition duration-300"
            >
              Boost Your Reach
            </button>

            <p className="mt-4 text-center text-gray-400 text-sm">
              Cancel anytime. No commitment.
            </p>
          </div>

          {/* Max */}
          <div className="bg-[#071b3b] text-white rounded-2xl p-8 shadow-xl border border-[#0e2a59]">
            <h2 className="text-2xl font-semibold mb-3">Max</h2>
            <p className="text-yellow-400 text-4xl font-bold">
              $30<span className="text-xl ml-1">/month</span>
            </p>

            <ul className="mt-6 space-y-3 text-gray-300">
              <li>✔ Everything in Plus</li>
              <li>✔ Send 50 emails/day</li>
              <li>✔ Save 10 templates</li>
              <li>✔ Attach files</li>
            </ul>

            <button
              onClick={() => handleSelect("Max")}
              className="mt-8 w-full py-3 rounded-xl bg-[#162b52] hover:bg-[#1e3a70] transition duration-300"
            >
              Go Maximum
            </button>

            <p className="mt-4 text-center text-gray-400 text-sm">
              Cancel anytime. No commitment.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
