import { z } from "zod";
import { VerseSchema } from "../../../DataModels/VerseModel";
import { LineSchema } from "../../../DataModels/LineModel";
import { SegmentSchema } from "../../../DataModels/SegmentModel";
import { ChordSchema } from "./ChordModel";

export const PayLoadSchema = z.object({
    verseCreate: VerseSchema,
    linesCreate: z.array(LineSchema),
    segmentsCreate: z.array(SegmentSchema),
    chordsCreate: z.array(ChordSchema),
})