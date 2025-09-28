import { z } from "zod";

/** Strip $, commas, spaces; keep digits, optional minus and dot. */
const toNumber = (val: unknown) => {
  if (typeof val === "string") {
    const cleaned = val.replace(/[^\d.-]/g, "");
    return cleaned === "" ? NaN : Number(cleaned);
  }
  return val;
};

const currency = z.preprocess(toNumber, z.number().min(0, "Must be 0 or greater"));

const eighteenYearsAgo = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d;
})();

export const onboardingSchema = z.object({
  // Step 1 — Client
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in the form XXX-XX-XXXX"),
  dob: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date")
    .refine((v) => new Date(v) <= eighteenYearsAgo, "You must be at least 18."),

  netWorth: currency,

  // Step 2 — Financial
  income: currency,
  investableAssets: currency,
  riskTolerance: z.enum(["Low", "Medium", "High"]),

  // Step 3 — Compliance
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge the disclosures" }),
  }),

  // Optional KYC/AML block (all optional; safe to expand later)
  kyc: z
    .object({
      citizenship: z.string().optional(),
      employmentStatus: z.string().optional(),
      sourceOfFunds: z.string().optional(),
    })
    .optional(),
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;

/** Default values for RHF */
export const defaultValues: OnboardingValues = {
  fullName: "",
  email: "",
  ssn: "",
  dob: "",
  netWorth: "" as any, // RHF will hold a string; zod will coerce to number
  income: "" as any,
  investableAssets: "" as any,
  riskTolerance: "Medium",
  termsAccepted: false,
  kyc: {
    citizenship: "",
    employmentStatus: "",
    sourceOfFunds: "",
  },
};