import { z } from "zod";

export const PageSchema = z.object({
  id: z.number(),
  title: z.string({message: "Page title is required!"}),
  slug: z.string().nullable(), 
  content: z.string({message: "what is the page about?"}),
  sorting: z.number(),
});

export type PageModel = z.infer<typeof PageSchema>;

const PageCreateSchema = PageSchema.omit({id:true});

export type PageCreateModel = z.infer<typeof PageCreateSchema>;

