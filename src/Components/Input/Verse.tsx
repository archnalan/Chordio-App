import React, { useEffect, useRef, useState } from "react";
import LyricLine from "./LyricLine";
import "./Verse.css";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";
import { LineModel } from "../Sections/LineModel";
import Chord from "./Chord";
import { VerseModel } from "../Sections/VerseModel";
import axios from "axios";

interface VerseProps {
  verse: VerseModel;
  lines: LineModel[];
  setLines: React.Dispatch<React.SetStateAction<LineModel[]>>;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Verse: React.FC<VerseProps> = ({
  verse,
  lines,
  setLines,
  setInputDisabled,
}) => {
  const [lineToEdit, setLineToEdit] = useState<LineModel | null>(null);

  const editInput = useRef<HTMLInputElement>(null);

  const handleEdit = (line: LineModel) => {
    setLineToEdit(line);
  };

  const handleEditOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (lineToEdit) {
      setLineToEdit({ ...lineToEdit, segments: e.target.value });
    }
  };

  const handleEditChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (lineToEdit) {
      const newLines = [...lines];
      const editIndex = newLines.findIndex(
        (line) => line.lyricLineOrder === lineToEdit.lyricLineOrder
      );
      if (editIndex != -1) {
        newLines[editIndex] = lineToEdit;
      }
      setLines(newLines);
      setLineToEdit(null);
    }
  };

  const handleEditCancel = () => {
    setLineToEdit(null);
  };

  useEffect(() => {
    if (lineToEdit) {
      editInput.current?.focus();
    }
  }, [lineToEdit]);

  //From LyricLine component
  const addInput = (lnIndex: number) => {
    const LinesToModify = [...lines];

    const newLineIndex = lnIndex + 1;

    LinesToModify.splice(newLineIndex, 0, {
      lyricLineOrder: newLineIndex,
      verseId: lineToEdit?.verseId || 1,
      segments: "",
    }); // Insert a new empty line at the correct position

    //update the subsequent lines
    for (let i = newLineIndex; i < LinesToModify.length; i++) {
      LinesToModify[i].lyricLineOrder = i + 1;
    }
    const newLines = LinesToModify; // Now the list is new
    console.log("🚀 ~ addInput ~ newLines:", newLines);
    setLines(newLines);
    setLineToEdit(newLines[newLineIndex]); // Set the new line to edit mode
  };

  useEffect(() => {
    console.log("🚀 ~ addInput ~ newLines:", lineToEdit);
  }, [lineToEdit]);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const verseCreate = {
        number: verse.number,
        hymnId: verse.hymnId,
      };
      console.log("🚀 ~ handleSave ~ verseCreate:", verseCreate);

      const linesCreate = lines.map((line) => ({
        LyricLineOrder: line.lyricLineOrder,
        verseId: line.verseId,
      }));
      console.log("🚀 ~ linesCreate ~ linesCreate:", linesCreate);

      const segmentsCreate = lines.flatMap((line, lineindex) =>
        line.segments.split(" ").map((segment, segmentIndex) => ({
          lyric: segment,
          lyricOrder: segmentIndex + 1,
          lyricLineId: lineindex + 1,
        }))
      );

      console.log("🚀 ~ handleSave ~ segmentCreate:", segmentsCreate);

      const payload = {
        verseCreate,
        linesCreate,
        segmentsCreate,
      };

      const response = axios.post(
        "https://localhost:7077/api/verses/create",
        payload
      );

      console.log("🚀 ~ handleSave ~ response:", response);
    } catch (error) {
      console.error("Error Saving verse", error);
    }
  };

  return (
    <div className="verse">
      <div>
        {lines.map((line, index) => (
          <div className="verse__line" key={index}>
            {lineToEdit && lineToEdit.lyricLineOrder === line.lyricLineOrder ? (
              <div className="verse__line-change">
                <Chord />
                <form onSubmit={handleEditChanges} className="verse__line-edit">
                  <input
                    ref={editInput}
                    value={lineToEdit.segments}
                    onChange={handleEditOnChange}
                    placeholder="Enter lyric line here..."
                  />
                  <button type="submit" className="verse__line-submit">
                    <LuArrowUpLeftSquare />
                  </button>
                  <span className="actions-delete" onClick={handleEditCancel}>
                    <MdCancelPresentation />
                  </span>
                </form>
              </div>
            ) : (
              <LyricLine
                key={index}
                lineIndex={index}
                line={line}
                lines={lines}
                setLines={setLines}
                editLine={() => handleEdit(line)}
                addInput={() => addInput(index)}
              />
            )}
          </div>
        ))}
      </div>
      {lines.length !== 0 && (
        <div className="verse__btns">
          <button className="verse__btns-save" onClick={handleSave}>
            Save
          </button>
          <button
            className="verse__btns-clear"
            onClick={() => {
              setLines([]);
              setInputDisabled(false);
            }}
          >
            clear
          </button>
        </div>
      )}
    </div>
  );
};

export default Verse;
