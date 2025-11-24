"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetSingleUserTemplateQuery } from "@/feature/TemplateApi";
import { useSession } from "next-auth/react";

export default function SelectTemplatePage() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const searchParams = useSearchParams();
  const emails = JSON.parse(searchParams.get("emails"));

  const { data } = useGetSingleUserTemplateQuery(email);
  const templates = data?.data || [];

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSend = () => {
    console.log("Selected Template ID:", selectedTemplate);
    console.log("Coach Emails:", emails);
  };

  return (
    <div className="min-h-screen bg-[#06152B] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Choose Email Template</h1>

      {/* Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {templates.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedTemplate(item._id)}
            className={`p-5 rounded-xl cursor-pointer border ${
              selectedTemplate === item._id
                ? "border-yellow-400 bg-[#132544]"
                : "border-gray-700 bg-[#10243E]"
            }`}
          >
            <h2 className="text-xl font-bold">{item.template.name}</h2>
            <p className="text-gray-300 mt-2">
              {item.template.subject}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-end max-w-6xl mx-auto mt-8">
        <button
          onClick={handleSend}
          disabled={!selectedTemplate}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            !selectedTemplate
              ? "bg-gray-600 cursor-not-allowed text-gray-300"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          Send Email
        </button>
      </div>
    </div>
  );
}
