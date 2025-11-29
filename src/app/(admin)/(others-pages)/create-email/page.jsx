"use client";

import { useGetSingleUserQuery } from "@/feature/UserApi";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import axios from "axios";
import { base_url } from "@/utils/utils";
import { useSaveEmailTemplateMutation } from "@/feature/TemplateApi";
import SecureProvider from '../../../../secureRoute/SecureProvider'
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const { data } = useSession();
  const email = data?.user?.email;

  const { data: userData } = useGetSingleUserQuery(email);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    graduationYear: "",
    gpa: "",
    height: "",
    weight: "",
    school: "",
    highlightLink: "",
    additionalInfo: "",
    subjectTemplate: "",
    emailTemplate: "",
    templateName: "", // New field for template name
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const [
    saveEmailTemplate,
    { isError, error, isLoading: isSaving },
  ] = useSaveEmailTemplateMutation();

  React.useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        position: user.position || "",
        graduationYear: user.graduationYear || "",
        gpa: user.gpa || "",
        height: user.height || "",
        weight: user.weight || "",
        school: user.team || "",
        highlightLink: "https://www.youtube.com/watch?v=Va5UWOJZn6Q",
        additionalInfo:
          "I was First Team All-League, First Team All-State, and my League's MVP.",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateEmailWithGPT = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${base_url}/gpt/generate-email`, {
        name: formData.name,
        position: formData.position,
        graduationYear: formData.graduationYear,
        gpa: formData.gpa,
        height: formData.height,
        weight: formData.weight,
        school: formData.school,
        highlightLink: formData.highlightLink,
        additionalInfo: formData.additionalInfo,
      });

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          subjectTemplate: response.data.subject,
          emailTemplate: response.data.email,
        }));
        toast.success("Email template generated successfully!");
      } else {
        toast.success("Failed to generate email template");
      }
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error(
        "429 You exceeded your current quota, please check your plan and billing details."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // 🔥 FIXED — Properly structured payload for backend
  const handleSaveTemplate = async () => {
    try {
      // Validate required fields
      if (!formData.templateName) {
        toast.alert("Please enter a template name");
        return;
      }

      if (!formData.subjectTemplate || !formData.emailTemplate) {
        toast.alert("Please generate an email template first");
        return;
      }

      if (!userData?.data?._id || !email) {
        toast.alert("User information is missing");
        return;
      }

      // Create properly structured payload matching backend expectations
      const payload = {
        user: userData.data._id, // MongoDB ObjectId
        email: email, // User's email
        name: formData.templateName, // Template name
        subject: formData.subjectTemplate, // Map to backend expected field
        body: formData.emailTemplate, // Map to backend expected field
        raw: `${formData.subjectTemplate}\n\n${formData.emailTemplate}`, // Create raw version
      };

      const res = await saveEmailTemplate(payload).unwrap();

      if (res.success) {
        toast.success("Template saved successfully!");
        // Clear template name after successful save
        setFormData(prev => ({ ...prev, templateName: "" }));
      } else {
        toast.error("Failed to save template");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving template: " + (err.data?.message || err.message));
    }
  };

  return (
  
    <SecureProvider>

        <div className="min-h-screen bg-[#0f172a] py-10 px-4">

          <Toaster/>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information, Link, Additional Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                      placeholder="Name"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                      placeholder="Position"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Graduation Year
                    </label>
                    <input
                      type="text"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                      placeholder="Graduation Year"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      GPA
                    </label>
                    <input
                      type="text"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                      placeholder="GPA"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Height
                    </label>
                    <input
                      type="text"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                      placeholder="Height"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      Weight
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                      placeholder="Weight"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm font-medium mb-2 block">
                      High School & Club Team
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                      placeholder="High School & Club Team"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Link and Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
                <h2 className="text-white text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                  Highlight Video Link
                </h2>
                <input
                  type="text"
                  name="highlightLink"
                  value={formData.highlightLink}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                  placeholder="Highlight Video Link"
                />
              </div>

              <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
                <h2 className="text-white text-xl font-semibold mb-4 pb-2 border-b border-gray-700">
                  Additional Information
                </h2>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all resize-none"
                  placeholder="Additional Information"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Template Preview and Buttons */}
          <div className="space-y-8">
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
              <h2 className="text-white text-xl font-semibold mb-6 pb-2 border-b border-gray-700">
                Template Preview
              </h2>
              <div className="space-y-4">
                {/* Template Name Input */}
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    name="templateName"
                    value={formData.templateName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                    placeholder="Enter template name (e.g., Recruitment Email v1)"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Subject Template
                  </label>
                  <input
                    type="text"
                    name="subjectTemplate"
                    value={formData.subjectTemplate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">
                    Email Template
                  </label>
                  <textarea
                    name="emailTemplate"
                    value={formData.emailTemplate}
                    onChange={handleChange}
                    rows={12}
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3AE41] focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Generate Button */}
                <button
                  onClick={generateEmailWithGPT}
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 bg-[#D3AE41] text-black font-semibold rounded-lg hover:bg-[#c19d35] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Generate Email"
                  )}
                </button>

                {/* Save Template Button */}
                <button
                  onClick={handleSaveTemplate}
                  disabled={isSaving || !formData.templateName}
                  className="flex-1 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Template"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SecureProvider>
  );
}