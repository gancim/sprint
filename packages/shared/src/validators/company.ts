import { z } from "zod";
import { COMPANY_STATUSES } from "../constants.js";

export const createCompanySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
});

export type CreateCompany = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = createCompanySchema
  .partial()
  .extend({
    status: z.enum(COMPANY_STATUSES).optional(),
  });

export type UpdateCompany = z.infer<typeof updateCompanySchema>;
