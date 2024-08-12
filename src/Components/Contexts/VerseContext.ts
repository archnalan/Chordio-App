import { createContext, useContext } from "react";
import { SegmentModel } from "../../DataModels/SegmentModel";
import { ChordModel } from "../Admin/Sections/ChordModel";
import { LineModel } from "../../DataModels/LineModel";

interface verseContextType {
  lines: LineModel[];
  chords: ChordModel[];
  segments: SegmentModel[];
  setLines:React.Dispatch<React.SetStateAction<LineModel[]>>
  setChords: React.Dispatch<React.SetStateAction<ChordModel[]>>;
  setSegments: React.Dispatch<React.SetStateAction<SegmentModel[]>>;
}
export const VerseContext = createContext<verseContextType | undefined>(
  undefined
);

export const useVerseContext = () => {
  const context = useContext(VerseContext);

  if (!context) {
    throw new Error("useSegmentContext must be used within a SegmentProvider");
  }

  return context;
}