'use client'
import React, { useState, useEffect } from "react";
import { useGetAllCoachesQuery, useSaveCoachMutation, useDeleteCoachMutation } from "../../../feature/CoachApi";
import { toast, Toaster } from 'react-hot-toast';

export default function CoachPage() {
  // State for filters and pagination
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    division: "",
    conference: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    conference: "",
    position: "",
    division: "Division I",
    gender: "Men"
  });

  // RTK Query hooks
  const { 
    data: coachesData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetAllCoachesQuery({
    page: currentPage,
    limit,
    ...filters
  });

  const [saveCoach, { isLoading: isSaving }] = useSaveCoachMutation();
  const [deleteCoach] = useDeleteCoachMutation();

  const coaches = coachesData?.data || [];
  const pagination = coachesData?.pagination || {};

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.gender, filters.division, filters.conference]);

  const openAddModal = () => {
    setEditingCoach(null);
    setFormData({
      name: "",
      email: "",
      school: "",
      conference: "",
      position: "",
      division: "Division I",
      gender: "Men"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coach) => {
    setEditingCoach(coach);
    setFormData({ ...coach });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this coach?')) {
      try {
        await deleteCoach(id).unwrap();
        toast.success("Coach deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete coach");
        console.error("Delete error:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCoach) {
        // Edit existing coach
        // await editCoach({ id: editingCoach._id, data: formData }).unwrap();
        // toast.success("Coach updated successfully");
      } else {
        // Add new coach
        await saveCoach(formData).unwrap();
        toast.success("Coach added successfully");
      }
      
      setIsModalOpen(false);
      refetch(); // Refresh the list
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error?.data?.message || "Failed to save coach");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      gender: "",
      division: "",
      conference: ""
    });
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl">Loading coaches...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-xl text-red-500">Error loading coaches</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <Toaster />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coaches</h1>
        <button
          onClick={openAddModal}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg transition-colors"
        >
          Add Coach
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Coed">Coed</option>
            </select>
          </div>

          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Division
            </label>
            <select
              value={filters.division}
              onChange={(e) => handleFilterChange('division', e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Divisions</option>
              <option value="Division I">Division I</option>
              <option value="Division II">Division II</option>
              <option value="Division III">Division III</option>
              <option value="NAIA">NAIA</option>
              <option value="NJCAA">NJCAA</option>
            </select>
          </div>

          {/* Conference Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Conference
            </label>
            <input
              type="text"
              placeholder="Filter by conference..."
              value={filters.conference}
              onChange={(e) => handleFilterChange('conference', e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-300">
          Showing {coaches.length} of {pagination.totalCoaches || 0} coaches
        </div>
      </div>

      {/* Coaches Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="px-4 py-3 border-b border-gray-700">Coach</th>
              <th className="px-4 py-3 border-b border-gray-700">School</th>
              <th className="px-4 py-3 border-b border-gray-700">Conference</th>
              <th className="px-4 py-3 border-b border-gray-700">Position</th>
              <th className="px-4 py-3 border-b border-gray-700">Division</th>
              <th className="px-4 py-3 border-b border-gray-700">Gender</th>
              <th className="px-4 py-3 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((coach) => (
              <tr key={coach._id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold">{coach.name}</div>
                  <div className="text-sm text-yellow-400">{coach.email}</div>
                </td>
                <td className="px-4 py-3">{coach.school}</td>
                <td className="px-4 py-3">{coach.conference}</td>
                <td className="px-4 py-3">{coach.position}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    coach.division === "Division I" ? "bg-blue-500 text-white" :
                    coach.division === "Division II" ? "bg-green-500 text-white" :
                    coach.division === "Division III" ? "bg-purple-500 text-white" :
                    "bg-gray-500 text-white"
                  }`}>
                    {coach.division}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    coach.gender === "Men" ? "bg-blue-400 text-white" :
                    coach.gender === "Women" ? "bg-pink-500 text-white" :
                    "bg-gray-500 text-white"
                  }`}>
                    {coach.gender}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => openEditModal(coach)}
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coach._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {coaches.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No coaches found matching your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrev}
            className={`px-4 py-2 rounded ${
              pagination.hasPrev 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-800 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <span className="text-gray-300">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!pagination.hasNext}
            className={`px-4 py-2 rounded ${
              pagination.hasNext 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-800 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal (same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
          <div className="bg-gray-800 rounded-lg w-full max-w-md z-50 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
              <h2 className="text-xl font-bold">
                {editingCoach ? "Edit Coach" : "Add Coach"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-2xl font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Form fields remain the same as your existing modal */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter coach name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter email address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">School</label>
                <input
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter school name"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Conference</label>
                <input
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter conference"
                  value={formData.conference}
                  onChange={(e) => setFormData({ ...formData, conference: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                <input
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Division</label>
                <select
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  required
                >
                  <option value="Division I">Division I</option>
                  <option value="Division II">Division II</option>
                  <option value="Division III">Division III</option>
                  <option value="NAIA">NAIA</option>
                  <option value="NJCAA">NJCAA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Coed">Coed</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingCoach ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}