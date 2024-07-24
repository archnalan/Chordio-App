import React, { useEffect, useRef, useState } from "react";
import LyricLine from "./LyricLine";
import "./Verse.css";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import { MdOutlineDelete } from "react-icons/md";
import { LineModel } from "../Sections/LineModel";

interface VerseProps {
  lines: LineModel[];
  setLines: React.Dispatch<React.SetStateAction<LineModel[]>>;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Verse: React.FC<VerseProps> = ({ lines, setLines, setInputDisabled }) => {
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
    const newLines = [...lines];
    const newLineIndex = lnIndex + 1;
    newLines.splice(newLineIndex, 0, {
      lyricLineOrder: newLineIndex,
      verseId: lineToEdit?.verseId || 1,
      segments: "",
    }); // Insert a new empty line at the correct position
    setLines(newLines);
    setLineToEdit(newLines[newLineIndex]); // Set the new line to edit mode
  };

  return (
    <div className="verse">
      <div>
        {lines.map((line, index) => (
          <div className="verse__line" key={index}>
            {lineToEdit && lineToEdit.lyricLineOrder === line.lyricLineOrder ? (
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
                  <MdOutlineDelete />
                </span>
              </form>
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
          <button className="verse__btns-save">Save</button>
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
