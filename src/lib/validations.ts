import { z } from "zod";

const isAdult = (iso: string) => {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  const dob = new Date(t);
  const now = new Date();
  const age =
    now.getFullYear() - dob.getFullYear() -
    (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
  return age >= 18;
};

export const onboardingSchema = z.object({
  // Step 1 – Client Info
  fullName: z.string().min(2, "Full name is required"),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in the format XXX-XX-XXXX"),
  dob: z.string().refine(isAdult, "Applicant must be at least 18"),
  email: z.string().email("Valid email is required"),
  netWorth: z.coerce.number({ invalid_type_error: "Net worth must be a number" }).nonnegative("Net worth cannot be negative"),

  // Step 2 – Financial Info
  income: z.coerce.number({ invalid_type_error: "Income must be a number" }).nonnegative("Income cannot be negative"),
  investableAssets: z.coerce.number({ invalid_type_error: "Investable assets must be a number" }).nonnegative("Investable assets cannot be negative"),
  riskTolerance: z.enum(["Low", "Medium", "High"], { required_error: "Select a risk tolerance" }),

  // Step 3 – Compliance
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "You must confirm to continue" }) }),

  // Optional KYC/AML
  kyc: z.object({
    citizenship: z.enum(["US", "Non-US"]).optional(),
    employmentStatus: z.enum(["Employed", "Self-Employed", "Unemployed", "Retired", "Student"]).optional(),
    sourceOfFunds: z.enum(["Employment", "Savings", "Business", "Inheritance", "Other"]).optional(),
  }).partial().optional(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

export const defaultValues: OnboardingValues = {
  fullName: "",
  ssn: "",
  dob: "",
  email: "",
  netWorth: 0,
  income: 0,
  investableAssets: 0,
  riskTolerance: "Medium",
  termsAccepted: false,
  kyc: {
    citizenship: undefined,
    employmentStatus: undefined,
    sourceOfFunds: undefined,
  },
};