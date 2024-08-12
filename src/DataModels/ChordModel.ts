import { z } from "zod";

export const ChordSchema = z.object({
    id: z.number(),
    chordName: z.string(),    
    difficulty: z.number().int().min(0).max(3),
    chartAudioFilePath: z.string().nullable().optional(),    
})

export type ChordModel = z.infer<typeof ChordSchema>;