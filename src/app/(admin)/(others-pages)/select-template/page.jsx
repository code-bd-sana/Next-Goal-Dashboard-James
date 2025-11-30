"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetSingleUserTemplateQuery } from "@/feature/TemplateApi";
import { useSession } from "next-auth/react";
import { useSendEmailMutation } from "@/feature/EmailApi";
import SecureProvider from "@/secureRoute/SecureProvider";
import toast, { Toaster } from "react-hot-toast";

export default function SelectTemplatePage() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const searchParams = useSearchParams();
  const coachesData = JSON.parse(searchParams.get("coaches"));

  const { data } = useGetSingleUserTemplateQuery(email);
  const templates = data?.data || [];

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 6;

  // New States for file upload and email sending
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({
    current: 0,
    total: 0,
    completed: 0,
    failed: 0,
    currentEmail: ""
  });
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [sendResults, setSendResults] = useState([]);

  // Extract emails and coach IDs from coachesData
  const emails = coachesData?.map(coach => coach.email) || [];
  const coachIds = coachesData?.map(coach => coach.coachId) || [];
  
  const [sendEmail, {isError, isLoading, error}] = useSendEmailMutation();

  console.log("📨 Received Coaches Data:", {
    rawData: coachesData,
    emails: emails,
    coachIds: coachIds,
    totalCoaches: coachesData?.length || 0
  });

  const filteredTemplates = templates.filter(
    (template) =>
      template.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.template?.subject
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      template.template?.body
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(
    indexOfFirstTemplate,
    indexOfLastTemplate
  );
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 📌 Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
    
    console.log("📎 Selected Files:", files.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      type: file.type
    })));
  };

  // 📌 Remove single file
  const removeFile = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  // 📌 Clear all files
  const clearAllFiles = () => {
    setAttachments([]);
  };

  // 📌 Send emails one by one with progress tracking
  const handleSend = async () => {
    if (!selectedTemplate) return alert("Select a template first");

    const template = templates.find((t) => t._id === selectedTemplate);
    
    console.log("🚀 Starting Email Sending Process:", {
      selectedTemplate: selectedTemplate,
      templateDetails: template,
      senderEmail: email,
      totalRecipients: emails.length,
      totalAttachments: attachments.length
    });

    // Initialize progress
    setSendProgress({
      current: 0,
      total: emails.length,
      completed: 0,
      failed: 0,
      currentEmail: emails[0] || ""
    });
    setSendResults([]);
    setShowProgressModal(true);
    setIsSending(true);

    const results = [];

    for (let i = 0; i < emails.length; i++) {
      const currentEmail = emails[i];
      const currentCoachId = coachIds[i];
      const currentCoachData = coachesData[i];

      // Update progress
      setSendProgress(prev => ({
        ...prev,
        current: i + 1,
        currentEmail: currentEmail
      }));

      try {
        console.log(`📤 Sending email ${i + 1}/${emails.length} to:`, currentEmail);

        // Create FormData properly
        const formData = new FormData();
        
        // Append text data
        formData.append("subject", template.template.subject || "No Subject");
        formData.append("body", template.template.body || "No Content");
        formData.append("sender", email || "");
        formData.append("recipient", currentEmail); // Single email
        formData.append("coachId", currentCoachId || "");
        formData.append("coachData", JSON.stringify(currentCoachData || {}));

        // Add attachments if any
        if (attachments && attachments.length > 0) {
          attachments.forEach((file) => {
            formData.append("attachments", file);
          });
        }

        // Debug: Check FormData contents
        console.log("📋 FormData contents:");
        for (let [key, value] of formData.entries()) {
          if (key === 'attachments') {
            console.log(`  ${key}:`, value.name, value.type, value.size);
          } else {
            console.log(`  ${key}:`, value);
          }
        }

        // Send single email using RTK Query mutation
        const response = await sendEmail(formData).unwrap();
        
        console.log(`✅ Email ${i + 1} sent successfully:`, response);
        
        results.push({
          email: currentEmail,
          status: 'success',
          message: response.message || 'Email sent successfully'
        });

        // Update completed count
        setSendProgress(prev => ({
          ...prev,
          completed: prev.completed + 1
        }));

        setSendResults([...results]);

      } catch (error) {
        console.error(`❌ Failed to send email ${i + 1} to ${currentEmail}:`, error?.data?.message);
        toast.error(error?.data?.message)
        
        results.push({
          email: currentEmail,
          status: 'error',
          message: error?.data?.message || error?.message || 'Failed to send email'
        });

        // Update failed count
        setSendProgress(prev => ({
          ...prev,
          failed: prev.failed + 1
        }));

        setSendResults([...results]);
      }

      // Small delay between emails to avoid rate limiting
      if (i < emails.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsSending(false);
    console.log("🎉 Email sending process completed:", results);
  };

  // 📌 Close progress modal and reset
  const closeProgressModal = () => {
    setShowProgressModal(false);
    if (sendProgress.completed + sendProgress.failed === sendProgress.total) {
      // All emails processed, reset selections
      setAttachments([]);
      setSelectedTemplate(null);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
  <SecureProvider>
    <Toaster/>

      <div className="min-h-screen bg-[#06152B] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Choose Email Template</h1>
      <p className="text-gray-400 mb-6 max-w-6xl mx-auto">
        Selected {emails?.length || 0} coaches
      </p>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-[#10243E] p-4 rounded-xl">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#0B1B31] border border-gray-700 text-white"
          />
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentTemplates.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedTemplate(item._id)}
              className={`p-6 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                selectedTemplate === item._id
                  ? "border-yellow-400 bg-[#132544] shadow-lg shadow-yellow-400/20"
                  : "border-gray-700 bg-[#10243E] hover:border-gray-500"
              }`}
            >
              <h2 className="text-xl font-bold text-amber-500">
                {item.name || "Unnamed Template"}
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                {item.template?.subject}
              </p>

              <p className="text-gray-300 text-sm line-clamp-3 mt-2">
                {item.template?.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced File Upload Section */}
      <div className="max-w-6xl mx-auto p-6 bg-[#10243E] rounded-xl mt-10 border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-amber-500">Add Attachments</h2>
        
        {/* File Input with Custom Styling */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Files
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <div className="bg-[#0B1B31] p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-amber-500 transition-colors duration-200 text-center">
                <div className="text-amber-500 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium">Click to upload files</p>
                <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
                <p className="text-gray-500 text-xs mt-1">Multiple files allowed</p>
              </div>
            </label>
          </div>
        </div>

        {/* Selected Files List */}
        {attachments.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-300">
                Selected Files ({attachments.length})
              </h3>
              <button
                onClick={clearAllFiles}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#0B1B31] rounded-lg border border-gray-700 hover:border-gray-500 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-amber-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 font-medium truncate text-sm">
                        {file.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 ml-2 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Send Button */}
      <div className="max-w-6xl mx-auto mt-8">
        <button
          onClick={handleSend}
          disabled={!selectedTemplate || isSending}
          className={`px-6 py-4 rounded-lg font-semibold mt-4 w-full transition-all duration-200 ${
            !selectedTemplate || isSending
              ? "bg-gray-600 cursor-not-allowed text-gray-400"
              : "bg-amber-400 hover:bg-amber-300 text-black shadow-lg hover:shadow-amber-400/25"
          }`}
        >
          {isSending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Sending Emails...
            </div>
          ) : (
            `Send Email to ${emails.length} Coach${emails.length !== 1 ? 'es' : ''}`
          )}
        </button>
        
        {/* Debug Info */}
        <div className="mt-4 p-3 bg-[#0B1B31] rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            <strong>Debug Info:</strong> Template Selected: {selectedTemplate ? "Yes" : "No"} | 
            Files: {attachments.length} | 
            Recipients: {emails.length} |
            Coach IDs: {coachIds.length}
          </p>
        </div>
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#10243E] rounded-2xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Sending Emails</h3>
              <p className="text-gray-400 mt-2">
                Sending emails one by one...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Progress</span>
                <span>{sendProgress.current}/{sendProgress.total}</span>
              </div>
              <div className="w-full bg-[#0B1B31] rounded-full h-3">
                <div 
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(sendProgress.current / sendProgress.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Current Email */}
            <div className="bg-[#0B1B31] rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-400 mb-1">Currently sending to:</p>
              <p className="text-amber-400 font-medium truncate text-sm">
                {sendProgress.currentEmail}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{sendProgress.total}</div>
                <div className="text-xs text-gray-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{sendProgress.completed}</div>
                <div className="text-xs text-gray-400">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{sendProgress.failed}</div>
                <div className="text-xs text-gray-400">Failed</div>
              </div>
            </div>

            {/* Results List */}
            {sendResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto mb-4">
                <p className="text-sm text-gray-400 mb-2">Recent results:</p>
                <div className="space-y-2">
                  {sendResults.slice(-5).map((result, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 truncate flex-1 mr-2">
                        {result.email}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === 'success' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {result.status === 'success' ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            {!isSending && (
              <button
                onClick={closeProgressModal}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            )}

            {/* Cancel Button */}
            {isSending && (
              <button
                onClick={closeProgressModal}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                disabled
              >
                Processing... Please wait
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  </SecureProvider>
  );
}