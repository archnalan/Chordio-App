import React, { useRef } from "react";
import Chord from "./Chord";
import "./Segment.css";

interface Props {
  segment: string;
  segments: string[];
  setSegments: React.Dispatch<React.SetStateAction<string[]>>;
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
        <span key={Date.now()}>{segment}</span>
      </div>
    </div>
  );
};

export default LyricSegment;
