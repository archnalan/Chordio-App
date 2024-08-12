import React, {
  FC,
  ReactNode,
  createContext,
  useState,
  useContext,
} from "react";
import { ChordModel } from "../Admin/Sections/ChordModel";

interface chordContextType {
  chords: ChordModel[];
  setChords: React.Dispatch<React.SetStateAction<ChordModel[]>>;
}

export const ChordContext = createContext<chordContextType | undefined>(
  undefined
);

export const ChordProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chords, setChords] = useState<ChordModel[]>([]);
  return (
    <ChordContext.Provider value={{ chords, setChords }}>
      {children}
    </ChordContext.Provider>
  );
};

export const useChordContext = () => {
  const context = useContext(ChordContext);

  if (!context) {
    throw new Error("useChordContext must be used within a ChordProvider");
  }
  return context;
};
export default ChordProvider;
