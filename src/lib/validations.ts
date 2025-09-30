import { z } from "zod";

// Calculate cutoff date for age 18
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
  dob: z.coerce
    .date()
    .refine((d) => d <= eighteenYearsAgo, "You must be at least 18."),

  // Step 2 — Financial (coerce strings → numbers)
  netWorth: z.coerce.number().min(0, "Must be 0 or greater"),
  income: z.coerce.number().min(0, "Must be 0 or greater"),
  investableAssets: z.coerce.number().min(0, "Must be 0 or greater"),
  riskTolerance: z.enum(["Low", "Medium", "High"]),

  // Step 3 — Compliance (boolean refined to true)
  termsAccepted: z
    .coerce
    .boolean()
    .refine((v) => v === true, { message: "You must acknowledge the disclosures" }),

  // Optional KYC/AML block (all optional)
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
  // keep as empty string for <input type="date">; Zod will coerce on submit
  dob: "" as unknown as Date,
  netWorth: 0,
  income: 0,
  investableAssets: 0,
  riskTolerance: "Medium",
  termsAccepted: false,
  kyc: {
    citizenship: "",
    employmentStatus: "",
    sourceOfFunds: "",
  },
};

// TODO: replace with real zod schemas later
export const noop = true;