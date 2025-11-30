"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SecureProvider from "@/secureRoute/SecureProvider";
import { useSession } from "next-auth/react";
import { useGetAllCoachesQuery } from "../../../feature/CoachApi";
import { useMyPlanQuery } from "@/feature/EmailApi";

export default function SelectCoachPage() {
  const router = useRouter();
  const { data: user } = useSession();
  const email = user?.user?.email;

  // --- Fetch user plan and today's count ---
  const { data: userLimit, isLoading: isLoadingLimit } = useMyPlanQuery(email);

  const todaysCount = userLimit?.todaysCount || 0;
  const plan = userLimit?.plan;

  // Plan wise limits
  const planLimits = {
    Starter: 15,
    Plus: 25,
    Max: 30,
  };

  // Today's remaining limit
  const limit = planLimits[plan] || 0;
  const remaining = limit - todaysCount;

  const [limitError, setLimitError] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    division: "",
    conference: ""
  });

  // Fetch all coaches
  const { data, isLoading } = useGetAllCoachesQuery({
    page: 1,
    limit: 100,
    ...filters
  });

  const coaches = data?.data || [];
  const [selectedCoaches, setSelectedCoaches] = useState([]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "All" ? "" : value
    }));
  };

  // Limit check logic
  const updateSelections = (newSelected) => {
    if (newSelected.length > remaining) {
      setLimitError(`You can select only ${remaining} more coach${remaining > 1 ? "es" : ""}.`);
      return;
    }
    setLimitError("");
    setSelectedCoaches(newSelected);
  };

  const handleSelectCoach = (coach) => {
    let updated = [];

    if (selectedCoaches.some((c) => c._id === coach._id)) {
      updated = selectedCoaches.filter((c) => c._id !== coach._id);
    } else {
      updated = [...selectedCoaches, coach];
    }

    updateSelections(updated);
  };

  // Filtered list
  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch =
      filters.search === "" ||
      coach.school.toLowerCase().includes(filters.search.toLowerCase()) ||
      coach.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      coach.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesGender = filters.gender === "" || coach.gender === filters.gender;
    const matchesDivision = filters.division === "" || coach.division === filters.division;

    const matchesConference =
      filters.conference === "" ||
      coach.conference.toLowerCase().includes(filters.conference.toLowerCase());

    return matchesSearch && matchesGender && matchesDivision && matchesConference;
  });

  const handleSelectAll = () => {
    if (selectedCoaches.length === filteredCoaches.length) {
      updateSelections([]);
      return;
    }

    const limitedCoaches = filteredCoaches.slice(0, remaining);
    updateSelections(limitedCoaches);
  };

  const isSelected = (coachId) => {
    return selectedCoaches.some((c) => c._id === coachId);
  };

  const handleContinue = () => {
    const coachData = selectedCoaches.map((coach) => ({
      email: coach.email,
      coachId: coach._id,
      name: coach.name,
      school: coach.school
    }));

    router.push("/select-template?coaches=" + JSON.stringify(coachData));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      gender: "",
      division: "",
      conference: ""
    });
  };

  if (isLoading || isLoadingLimit) {
    return (
      <div className="min-h-screen bg-[#06152B] text-white px-6 py-10 flex items-center justify-center">
        <div className="text-xl">Loading coaches...</div>
      </div>
    );
  }

  return (
    <SecureProvider>
      <div className="min-h-screen bg-[#06152B] text-white px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Select Coaches</h1>

        {/* FILTER BAR */}
        <div className="bg-[#10243E] p-5 rounded-xl shadow-xl w-full max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Search school, coach or email..."
              className="bg-[#0B1B31] border border-gray-700 px-4 py-2 w-72 rounded-lg text-white"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />

            <select
              className="bg-[#0B1B31] px-4 py-2 rounded-lg border border-gray-700 text-white"
              value={filters.gender || "All"}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            >
              <option value="All">All Genders</option>
              <option value="Men">Men's</option>
              <option value="Women">Women's</option>
              <option value="Coed">Coed</option>
            </select>

            <select
              className="bg-[#0B1B31] px-4 py-2 rounded-lg border border-gray-700 text-white"
              value={filters.division || "All"}
              onChange={(e) => handleFilterChange("division", e.target.value)}
            >
              <option value="All">All Divisions</option>
              <option value="Division I">Division I</option>
              <option value="Division II">Division II</option>
              <option value="Division III">Division III</option>
              <option value="NAIA">NAIA</option>
              <option value="NJCAA">NJCAA</option>
            </select>

            <input
              type="text"
              placeholder="Conference..."
              className="bg-[#0B1B31] border border-gray-700 px-4 py-2 w-48 rounded-lg text-white"
              value={filters.conference}
              onChange={(e) => handleFilterChange("conference", e.target.value)}
            />

            <button
              onClick={handleSelectAll}
              className="bg-[#F7C438] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-300"
            >
              {selectedCoaches.length === filteredCoaches.length &&
              filteredCoaches.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>

            <button
              onClick={clearFilters}
              className="bg-gray-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Clear Filters
            </button>
          </div>

          {/* Remaining Limit */}
          <div className="mt-4 text-yellow-400 text-sm">
            You can send <b>{remaining}</b> more email{remaining !== 1 ? "s" : ""} today.
          </div>

          {/* LIMIT ERROR */}
          {limitError && (
            <div className="mt-3 p-3 bg-red-600 text-white rounded-lg font-semibold">
              ⚠️ {limitError}
            </div>
          )}

          {/* Results Table */}
          <div className="mt-6 overflow-x-auto">
            {filteredCoaches.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No coaches found matching your filters.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="text-gray-300 border-b border-gray-600">
                  <tr>
                    <th className="py-3 px-2">Select</th>
                    <th className="py-3 px-4">Coach</th>
                    <th className="py-3 px-4">School</th>
                    <th className="py-3 px-4">Conference</th>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Division</th>
                    <th className="py-3 px-4">Gender</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCoaches.map((coach) => (
                    <tr
                      key={coach._id}
                      className="border-b border-gray-700 hover:bg-[#0D2038]"
                    >
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={isSelected(coach._id)}
                          onChange={() => handleSelectCoach(coach)}
                          className="w-4 h-4"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold">{coach.name}</div>
                        <div className="text-gray-400 text-sm">{coach.email}</div>
                        <div className="text-gray-500 text-xs">ID: {coach._id}</div>
                      </td>

                      <td className="py-3 px-4">{coach.school}</td>
                      <td className="py-3 px-4">{coach.conference}</td>
                      <td className="py-3 px-4">{coach.position}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            coach.division === "Division I"
                              ? "bg-blue-500"
                              : coach.division === "Division II"
                              ? "bg-green-500"
                              : coach.division === "Division III"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {coach.division}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            coach.gender === "Men"
                              ? "bg-blue-400"
                              : coach.gender === "Women"
                              ? "bg-pink-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {coach.gender}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* CONTINUE BUTTON */}
        <div className="flex justify-end mt-8 max-w-6xl mx-auto">
          <button
            onClick={handleContinue}
            disabled={selectedCoaches.length === 0 || limitError}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              selectedCoaches.length === 0 || limitError
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            Continue ({selectedCoaches.length})
          </button>
        </div>
      </div>
    </SecureProvider>
  );
}
