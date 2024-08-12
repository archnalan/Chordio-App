import React, {
  FC,
  createContext,
  useState,
  ReactNode,
  useContext,
} from "react";
import { SegmentModel } from "../../DataModels/SegmentModel";

interface segmentContextType {
  segments: SegmentModel[];
  setSegments: React.Dispatch<React.SetStateAction<SegmentModel[]>>;
}

export const SegmentContext = createContext<segmentContextType | undefined>(
  undefined
);

export const SegmentProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [segments, setSegments] = useState<SegmentModel[]>([]);
  return (
    <SegmentContext.Provider value={{ segments, setSegments }}>
      {children}
    </SegmentContext.Provider>
  );
};

export const useSegmentContext = () => {
  const context = useContext(SegmentContext);

  if (!context) {
    throw new Error("useSegmentContext must be used within a SegmentProvider");
  }

  return context;
};
export default SegmentProvider;
