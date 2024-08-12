import React, { useRef } from "react";
import Chord from "./Chord";
import "./Segment.css";
import { SegmentModel } from "../../../DataModels/SegmentModel";
import { useVerseContext } from "../../Contexts/VerseContext";

interface Props {
  segment: SegmentModel;
}
const LyricSegment: React.FC<Props> = ({ segment }) => {
  const { setSegments } = useVerseContext();

  const chordInputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    chordInputRef.current?.focus();
  };

  const updatedChordId = (chordId: number | null) => {
    console.log("🚀 ~ updatedChordId ~ chordId:", chordId);
    setSegments((prevSegments) =>
      prevSegments.map((seg) =>
        seg.lyricLineId === segment.lyricLineId &&
        seg.lyricOrder === segment.lyricOrder
          ? { ...seg, chordId }
          : seg
      )
    );
  };

  return (
    <div className="segment">
      <div className="segment__chord">
        <Chord
          ref={chordInputRef}
          segment={segment}
          setChordId={updatedChordId}
        />
      </div>
      <div className="segment__lyric" onClick={handleInputFocus}>
        <span key={segment.lyricOrder}>{segment.lyric}</span>
      </div>
    </div>
  );
};

export default LyricSegment;
