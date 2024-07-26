import { LineModel } from "./LineModel";
import { SegmentModel } from "./SegmentModel";

export interface VerseModel {
    number: number,
    hymnId: number,
    linesCreate: LineModel[],
    segmentsCreate: SegmentModel[]
    lyrics: string    
}