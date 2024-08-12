import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().max(100),
  sorting: z.number().optional(),
  parentCategoryId: z.number().nullable(),
  categorySlug: z.string().max(255).optional(),
});

export type CategoryModel = z.infer<typeof CategorySchema>;
