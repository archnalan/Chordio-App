import { z } from "zod";
import { CategorySchema } from "./CategoryModel";

export const HymnBookSchema = z.object({
  id: z.number(),
  title: z.string().max(50),
  slug: z.string().max(50).optional(),
  subTitle: z.string().max(255).optional(),
  description: z.string(),
  publisher: z.string().max(255),
  publicationDate: z.string()/*. transform((str) => new Date(str)) */,
  isbn: z.string().refine(value => value.length >= 10 && value.length <= 13, {
    message: "ISBN must be 10 to 13 characters long",
  }),
  author: z.string().max(255).optional(),
  edition: z.string().max(50).optional(),
  language: z.string().max(50),
  addedBy: z.string().optional(),
  addedTime: z.string()/* .transform((str) => new Date(str)) */,
});

export type HymnBookModel = z.infer<typeof HymnBookSchema>;

export const BookWithCategorySchema = HymnBookSchema.extend({
    categories: z.array(CategorySchema),
})

export type BookWithCategory = z.infer<typeof BookWithCategorySchema>;

export const BookCreateSchema = HymnBookSchema.omit({id: true});

export type HymnCreateModel = z.infer<typeof BookCreateSchema>;