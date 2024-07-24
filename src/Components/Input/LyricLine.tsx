import React, { useEffect, useState } from "react";
import LyricSegment from "./LyricSegment";
import "./Line.css";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { TbPlaylistAdd } from "react-icons/tb";
import { LineModel } from "../Sections/LineModel";

interface Props {
  lineIndex: number;
  line: LineModel;
  lines: LineModel[];
  setLines: React.Dispatch<React.SetStateAction<LineModel[]>>;
  editLine: () => void;
  addInput: () => void;
}

const LyricLine: React.FC<Props> = ({
  lineIndex,
  line,
  lines,
  setLines,
  editLine,
  addInput,
}) => {
  const [segments, setSegments] = useState<string[]>([]);

  useEffect(() => {
    const handleLine = (line: string) => {
      let seg = line.split(" ");
      setSegments(seg);
    };
    handleLine(line.segments);
  }, [line.segments]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    setLines(lines.filter((_, index) => index !== lineIndex));
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    editLine();
  };

  const handleInputAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    addInput();
  };
  return (
    <div className="line">
      <div className="lyricLine">
        {segments.map((segment, index) => (
          <LyricSegment
            key={index}
            segment={segment}
            segments={segments}
            setSegments={setSegments}
          />
        ))}
      </div>
      <div className="actions">
        <span className="actions-edit">
          <CiEdit onClick={handleEdit} />
        </span>
        <span className="actions-delete" onClick={handleDelete}>
          <MdOutlineDelete />
        </span>
        <span className="actions-add" onClick={handleInputAdd}>
          <TbPlaylistAdd />
        </span>
      </div>
    </div>
  );
};

export default LyricLine;
