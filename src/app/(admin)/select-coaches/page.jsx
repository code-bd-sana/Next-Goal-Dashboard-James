"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useGetAllCoachesQuery } from "../../../feature/CoachApi";

export default function SelectCoachPage() {
  const router = useRouter();

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    division: "",
    conference: ""
  });

  const { data, isLoading } = useGetAllCoachesQuery({ 
    page: 1, 
    limit: 100, // Increased limit to show more coaches
    ...filters 
  });
  
  const coaches = data?.data || [];
  const [selectedCoaches, setSelectedCoaches] = useState([]);

  console.log(data, "Coaches data");

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "All" ? "" : value
    }));
  };

  const handleSelectCoach = (coach) => {
    if (selectedCoaches.some((c) => c.email === coach.email)) {
      setSelectedCoaches(selectedCoaches.filter((c) => c.email !== coach.email));
    } else {
      setSelectedCoaches([...selectedCoaches, coach]);
    }
  };

  const handleSelectAll = () => {
    // Select all currently filtered coaches
    if (selectedCoaches.length === filteredCoaches.length) {
      // If all are selected, deselect all
      setSelectedCoaches([]);
    } else {
      // Otherwise select all filtered coaches
      setSelectedCoaches([...filteredCoaches]);
    }
  };

  const isSelected = (email) => {
    return selectedCoaches.some((c) => c.email === email);
  };

  // Client-side search for additional filtering
  const filteredCoaches = coaches.filter((coach) => {
    const matchesSearch = filters.search === "" || 
      coach.school.toLowerCase().includes(filters.search.toLowerCase()) ||
      coach.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      coach.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesGender = filters.gender === "" || 
      coach.gender === filters.gender;

    const matchesDivision = filters.division === "" || 
      coach.division === filters.division;

    const matchesConference = filters.conference === "" || 
      coach.conference.toLowerCase().includes(filters.conference.toLowerCase());

    return matchesSearch && matchesGender && matchesDivision && matchesConference;
  });

  const handleContinue = () => {
    const allEmails = selectedCoaches.map((c) => c.email);
    console.log("Selected Emails:", allEmails);
    router.push("/select-template?emails=" + JSON.stringify(allEmails));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      gender: "",
      division: "",
      conference: ""
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06152B] text-white px-6 py-10 flex items-center justify-center">
        <div className="text-xl">Loading coaches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06152B] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Select Coaches</h1>

      {/* FILTER BAR */}
      <div className="bg-[#10243E] p-5 rounded-xl shadow-xl w-full max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search school, coach or email..."
            className="bg-[#0B1B31] border border-gray-700 px-4 py-2 w-72 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          {/* Gender Filter */}
          <select
            className="bg-[#0B1B31] px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={filters.gender || "All"}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          >
            <option value="All">All Genders</option>
            <option value="Men">Men's</option>
            <option value="Women">Women's</option>
            <option value="Coed">Coed</option>
          </select>

          {/* Division Filter */}
          <select
            className="bg-[#0B1B31] px-4 py-2 rounded-lg border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={filters.division || "All"}
            onChange={(e) => handleFilterChange('division', e.target.value)}
          >
            <option value="All">All Divisions</option>
            <option value="Division I">Division I</option>
            <option value="Division II">Division II</option>
            <option value="Division III">Division III</option>
            <option value="NAIA">NAIA</option>
            <option value="NJCAA">NJCAA</option>
          </select>

          {/* Conference Filter */}
          <input
            type="text"
            placeholder="Conference..."
            className="bg-[#0B1B31] border border-gray-700 px-4 py-2 w-48 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={filters.conference}
            onChange={(e) => handleFilterChange('conference', e.target.value)}
          />

          {/* Select All Button */}
          <button
            onClick={handleSelectAll}
            className="bg-[#F7C438] text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
          >
            {selectedCoaches.length === filteredCoaches.length && filteredCoaches.length > 0 
              ? "Deselect All" 
              : "Select All"}
          </button>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className="bg-gray-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
          >
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-300">
          Showing {filteredCoaches.length} of {coaches.length} coaches
          {selectedCoaches.length > 0 && ` • ${selectedCoaches.length} selected`}
        </div>

        {/* TABLE */}
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
                {filteredCoaches.map((coach, index) => (
                  <tr
                    key={coach._id || index}
                    className="border-b border-gray-700 hover:bg-[#0D2038] transition"
                  >
                    <td className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={isSelected(coach.email)}
                        onChange={() => handleSelectCoach(coach)}
                        className="w-4 h-4 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold">{coach.name}</div>
                      <div className="text-gray-400 text-sm">{coach.email}</div>
                    </td>

                    <td className="py-3 px-4">{coach.school}</td>
                    <td className="py-3 px-4">{coach.conference}</td>
                    <td className="py-3 px-4">{coach.position}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coach.division === "Division I" ? "bg-blue-500 text-white" :
                        coach.division === "Division II" ? "bg-green-500 text-white" :
                        coach.division === "Division III" ? "bg-purple-500 text-white" :
                        "bg-gray-500 text-white"
                      }`}>
                        {coach.division}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coach.gender === "Men" ? "bg-blue-400 text-white" :
                        coach.gender === "Women" ? "bg-pink-500 text-white" :
                        "bg-gray-500 text-white"
                      }`}>
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
          disabled={selectedCoaches.length === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            selectedCoaches.length === 0
              ? "bg-gray-600 cursor-not-allowed text-gray-300"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          Continue ({selectedCoaches.length})
        </button>
      </div>
    </div>
  );
}