"use client";

import { useState } from "react";
import {
  personalInfoSchema,
  financialInfoSchema,
  complianceSchema,
} from "@/lib/validation";
import { z } from "zod";

const steps = ["Personal Info", "Financial Info", "Compliance", "Review"];

export default function OnboardingWizard({ token }: { token: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    let schema;
    if (currentStep === 0) schema = personalInfoSchema;
    if (currentStep === 1) schema = financialInfoSchema;
    if (currentStep === 2) schema = complianceSchema;

    if (!schema) return true;

    const result = schema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <label className="block mb-2">Full Name*</label>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={formData.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />

            <label className="block mb-2">SSN* (###-##-####)</label>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={formData.ssn || ""}
              onChange={(e) => handleChange("ssn", e.target.value)}
            />

            <label className="block mb-2">Date of Birth* (YYYY-MM-DD)</label>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={formData.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
            />

            <label className="block mb-2">Email*</label>
            <input
              type="email"
              className="border p-2 w-full"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <label className="block mb-2">Net Worth*</label>
            <input
              type="number"
              className="border p-2 w-full mb-2"
              value={formData.netWorth || ""}
              onChange={(e) =>
                handleChange("netWorth", Number(e.target.value))
              }
            />

            <label className="block mb-2">Annual Income*</label>
            <input
              type="number"
              className="border p-2 w-full mb-2"
              value={formData.income || ""}
              onChange={(e) =>
                handleChange("income", Number(e.target.value))
              }
            />

            <label className="block mb-2">Risk Tolerance*</label>
            <select
              className="border p-2 w-full"
              value={formData.riskTolerance || ""}
              onChange={(e) => handleChange("riskTolerance", e.target.value)}
            >
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.termsAccepted || false}
                onChange={(e) => handleChange("termsAccepted", e.target.checked)}
                className="mr-2"
              />
              I agree to the Terms and Conditions*
            </label>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-lg font-bold mb-2">Review Your Info</h2>
            <pre className="bg-gray-100 p-3 rounded">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Client Onboarding Wizard</h1>
      <div className="flex justify-between mb-6">
        {steps.map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center ${
              i === currentStep ? "font-bold" : "text-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="min-h-[200px]">{renderStep()}</div>

      {Object.keys(errors).length > 0 && (
        <div className="text-red-600 text-sm mt-2">
          {Object.values(errors).map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
