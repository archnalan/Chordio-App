import { z } from "zod";
import { ChartSchema } from "./ChartModel";

export const ChordSchema = z.object({
  id: z.number().int({ message: "ID must be an integer" }),
  chordName: z.string().min(1, { message: "Chord name is required" }),
  difficulty: z.number({ message: "please choose a valid chord!" }).nullable(),
  chartAudioFilePath: z.string().nullable().optional(),
});

export type ChordModel = z.infer<typeof ChordSchema>;

export const ChordEditSchema = ChordSchema.extend({
  chartAudioUpload: z
    .instanceof(File, {
      message: "Choose correct audio file type",
    })
    .nullable()
    .optional(),
});

export type ChordEditModel = z.infer<typeof ChordEditSchema>;

export const ChordCreateSchema = ChordEditSchema.omit({ id: true });

export type ChordCreateModel = z.infer<typeof ChordCreateSchema>;

export const ChordWithChartsSchema = ChordSchema.extend({
  /* charts: z.array(ChartSchema).nullable().optional(), */
  charts: z.any(),
});


export type ChordWithChartsModel = z.infer<typeof ChordWithChartsSchema>;