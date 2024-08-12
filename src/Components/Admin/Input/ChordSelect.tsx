import React, { useEffect, useState } from "react";
import ChordsFetch from "./ChordsFetch";
import { Chord } from "./ChordModel";
import "./ChordSelect.css";

const ChordSelect: React.FC = () => {
  const [chords, setChords] = useState<Chord[]>([]);
  useEffect(() => {
    const getChord = async () => {
      try {
        const response = await ChordsFetch.fetchAllChords();
        console.log("🚀 ~ useEffect ~ response:", response);

        setChords(response.data.$values);
      } catch (error) {
        console.error(error);
      }
    };
    getChord();
  }, []);

  return (
    <div className="chord__select">
      <select className="chord__select-tag">
        {chords.map((chord) => (
          <option key={chord.id} value={chord.difficulty}>
            {chord.chordName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChordSelect;
