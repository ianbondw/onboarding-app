import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  ssn: z
    .string()
    .regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format ###-##-####"),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be YYYY-MM-DD"),
  email: z.string().email("Invalid email"),
});

export const financialInfoSchema = z.object({
  netWorth: z.number().positive("Net worth must be positive"),
  income: z.number().positive("Income must be positive"),
  riskTolerance: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Select a risk tolerance" }),
  }),
});

export const complianceSchema = z.object({
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept terms to continue" }),
  }),
});
