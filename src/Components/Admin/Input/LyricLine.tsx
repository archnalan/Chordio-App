import React, { useEffect, useState } from "react";
import LyricSegment from "./LyricSegment.tsx";
import "./Line.css";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { TbPlaylistAdd } from "react-icons/tb";
import { LineModel } from "../../../DataModels/LineModel.ts";
import { useVerseContext } from "../../Contexts/VerseContext.ts";
import { SegmentModel } from "../../../DataModels/SegmentModel.ts";

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
  const { setSegments } = useVerseContext();
  const [lineSegments, setLineSegments] = useState<SegmentModel[]>([]);

  useEffect(() => {
    const lyricLineId = line.lyricLineOrder;
    const handleLine = (line: string) => {
      if (line !== "") {
        let segs = line.trim().split(" ");

        let newSegments = segs.map((seg, index) => ({
          lyric: seg,
          lyricOrder: index + 1,
          lyricLineId,
          chordId: null,
        }));
        console.log("🚀 ~ handleLine ~ newSegmentshere:", newSegments);

        setLineSegments(newSegments);
      }
    };

    handleLine(line.lineLyrics);
  }, [line.lineLyrics]);

  useEffect(() => {
    setSegments((prevSegments) => [
      ...prevSegments.filter((seg) => seg.lyricLineId !== line.lyricLineOrder),
      ...lineSegments,
    ]);
  }, [lineSegments]);

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
        {lineSegments.map((segment, index) => (
          <LyricSegment key={index} segment={segment} />
        ))}
      </div>
      <div className="actions">
        <span className="actions-edit">
          <CiEdit onClick={handleEdit} />
        </span>
        <span className="actions-delete" onClick={handleDelete}>
          <MdOutlineDelete />
        </span>
        <span
          className="actions-add"
          onClick={() => {
            handleInputAdd;
          }}
        >
          <TbPlaylistAdd />
        </span>
      </div>
    </div>
  );
};

export default LyricLine;
