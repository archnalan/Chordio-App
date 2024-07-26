import React, { useRef } from "react";
import Chord from "./Chord";
import "./Segment.css";
import { SegmentModel } from "../Sections/SegmentModel";

interface Props {
  segment: SegmentModel;
  segments: SegmentModel[];
  setSegments: React.Dispatch<React.SetStateAction<SegmentModel[]>>;
}
const LyricSegment: React.FC<Props> = ({ segment, segments, setSegments }) => {
  const chordInputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    chordInputRef.current?.focus();
  };

  return (
    <div className="segment">
      <div className="segment__chord">
        <Chord
          /* key={Date.now()} */
          ref={chordInputRef} /* inputFocus={inputFocus} */
        />
      </div>
      <div className="segment__lyric" onClick={handleInputFocus}>
        <span key={segment.lyricOrder}>{segment.lyric}</span>
      </div>
    </div>
  );
};

export default LyricSegment;
