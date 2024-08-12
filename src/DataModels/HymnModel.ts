import { z } from "zod";

export  const HymnSchema = z.object ({
    id: z.number(),
    number: z.number({message:"Please enter a number!"}).positive({message:"A positive number is required!"}),
    title: z.string({message: "Please enter a title."}),
    slug: z.string().optional(),
    writtenDateRange: z.string({message:"Invalid Date Range!"}).optional(),
    writtenBy: z.string().optional(),
    history: z.string().optional(),
    addedBy: z.string().optional(),
    categoryId: z.number({message: "Invalid category!"}),  
})

export type HymnModel = z.infer<typeof HymnSchema>;

export const HymnWithCategorySchema = HymnSchema.extend({
    categoryName: z.string(),
})

export type HymnWithCategory = z.infer<typeof HymnWithCategorySchema>;

export const HymnCreateSchema = HymnSchema.omit({id: true});

export type HymnCreateModel = z.infer<typeof HymnCreateSchema>;

