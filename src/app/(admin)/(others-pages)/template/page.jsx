'use client'

import React, { useState } from 'react';
import { useDeleteEmailTemplateMutation, useEditEmailTemplateMutation, useGetSingleUserTemplateQuery } from '@/feature/TemplateApi';
import { useSession } from 'next-auth/react';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import SecureProvider from '@/secureRoute/SecureProvider';

export default function EmailTemplatesPage() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const { data: templatesData, isLoading, isError, refetch } = useGetSingleUserTemplateQuery(email);
  const templates = templatesData?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 10;

  const [viewTemplate, setViewTemplate] = useState(null);
  const [editTemplate, setEditTemplate] = useState(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subject: '',
    body: '',
    raw: ''
  });
  
  const [editEmailTemplate, {isLoading: editLoading, isError: editIsError, error: editError}] = useEditEmailTemplateMutation();
  const [deleteEmailTemplate, {isLoading:deleteLoading, error:deleteError, isError:dleteIsError}] = useDeleteEmailTemplateMutation();


  // Pagination logic
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = templates.slice(indexOfFirstTemplate, indexOfLastTemplate);

  const totalPages = Math.ceil(templates.length / templatesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleView = (template) => {
    setViewTemplate(template);
  };

  const handleEdit = (template) => {
    setEditTemplate(template);
    setEditFormData({
      subject: template.template.subject,
      body: template.template.body,
      raw: template.template.raw || `${template.template.subject}\n\n${template.template.body}`
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!editTemplate) return;

    try {
      const payload = {
        id: editTemplate._id,
        sub: editFormData.subject, // Matches backend 'sub' parameter
        body: editFormData.body,   // Matches backend 'body' parameter
        raw: editFormData.raw      // Matches backend 'raw' parameter
      };

      const result = await editEmailTemplate(payload).unwrap();
      
      if (result.message === "Success") {
        alert('Template updated successfully!');
        setEditTemplate(null);
        setEditFormData({ subject: '', body: '', raw: '' });
        refetch(); // Refresh the templates list
      } else {
        alert('Failed to update template');
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Error updating template: ' + (error.data?.message || error.message));
    }
  };

  const handleDelete = async(id) => {
    setDeleteTemplateId(id);
    if (confirm('Are you sure you want to delete this template?')) {
      console.log('Confirmed Delete:', id);


      await deleteEmailTemplate(id)
      alert("Template delete successfully")
      // Here you can call delete API
    }
  };

  if (isLoading) return <div className="text-white text-center py-10">Loading...</div>;
  if (isError) return <div className="text-red-500 text-center py-10">Error loading templates.</div>;

  return (
 
    <SecureProvider>

         <div className="min-h-screen bg-[#0f172a] py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-white text-3xl font-bold mb-6">Your Email Templates</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentTemplates.map((item) => (
            <div key={item._id} className="bg-[#1e293b] rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow relative">
                <h2 className=" text-2xl text-yellow-500 font-semibold mb-2">
                {item.name}
              </h2>
              <h2 className="text-white text-xl font-semibold mb-2">
                {item.template.subject}      
              </h2>
              <p className="text-gray-300 text-sm whitespace-pre-line">
                {item.template.body.length > 100
                  ? item.template.body.slice(0, 100) + '...'
                  : item.template.body}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleView(item)}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                >
                  <AiOutlineEye className="w-4 h-4 mr-1" /> View
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center px-3 py-1 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
                >
                  <AiOutlineEdit className="w-4 h-4 mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
                >
                  <AiOutlineDelete className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  currentPage === num
                    ? 'bg-[#D3AE41] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                } transition-colors`}
              >
                {num}
              </button>
            ))}
          </div>
        )}

        {/* View Modal */}
        {viewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">

              
              <h2 className="text-white text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
                {viewTemplate.template.subject}
              </h2>
              <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                {viewTemplate.template.body}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-gray-400 text-sm">
                  <strong>Created:</strong> {new Date(viewTemplate.createdAt).toLocaleString()}
                </p>
                {viewTemplate.template.raw && (
                  <p className="text-gray-400 text-sm mt-2">
                    <strong>Raw Format:</strong> Available
                  </p>
                )}
              </div>
              <button
                onClick={() => setViewTemplate(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
              >
                ✖
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <h2 className="text-white text-xl font-semibold mb-4">Edit Template</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={editFormData.subject}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Email Body
                  </label>
                  <textarea
                    name="body"
                    value={editFormData.body}
                    onChange={handleEditChange}
                    rows={8}
                    className="w-full p-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent resize-none"
                  />
                </div>

                <div>
               
                 
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setEditTemplate(null);
                    setEditFormData({ subject: '', body: '', raw: '' });
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black transition-colors flex items-center"
                >
                  {editLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  setEditTemplate(null);
                  setEditFormData({ subject: '', body: '', raw: '' });
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </SecureProvider>
  );
}