import React, { useEffect, useRef, useState } from "react";
import LyricLine from "./LyricLine";
import "./Verse.css";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";
import { LineModel } from "../../../DataModels/LineModel";
import { useVerseContext } from "../../Contexts/VerseContext";

interface VerseProps {
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const Verse: React.FC<VerseProps> = ({ setInputDisabled, handleSave }) => {
  const { lines, setLines } = useVerseContext();
  const [lineToEdit, setLineToEdit] = useState<LineModel | null>(null);

  const editInput = useRef<HTMLInputElement>(null);

  const handleEdit = (line: LineModel) => {
    setLineToEdit(line);
  };

  const handleEditOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (lineToEdit) {
      setLineToEdit({ ...lineToEdit, lineLyrics: e.target.value });
    }
  };

  const handleEditChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (lineToEdit) {
      const newLines = lines.map((line) =>
        line.lyricLineOrder === lineToEdit.lyricLineOrder ? lineToEdit : line
      );
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

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ lines:", lines);
  }, [lines]);

  //From LyricLine component
  const addInput = (lnIndex: number) => {
    const LinesToModify = [...lines];

    const newLineIndex = lnIndex + 1;

    LinesToModify.splice(newLineIndex, 0, {
      lyricLineOrder: newLineIndex,
      verseId: lineToEdit?.verseId || 1,
      lineLyrics: "",
    }); // Insert a new empty line at the correct position

    //update the subsequent lines
    for (let i = newLineIndex; i < LinesToModify.length; i++) {
      LinesToModify[i].lyricLineOrder = i + 1;
    }
    const newLines = LinesToModify; // Now the list is new
    setLines(newLines);
    setLineToEdit(newLines[newLineIndex]); // Set the new line to edit mode
  };

  return (
    <div className="verse">
      <div>
        {lines.map((line, index) => (
          <div className="verse__line" key={index}>
            {lineToEdit && lineToEdit.lyricLineOrder === line.lyricLineOrder ? (
              <div className="verse__line-change">
                {/* <Chord /> */}
                <form onSubmit={handleEditChanges} className="verse__line-edit">
                  <input
                    ref={editInput}
                    value={lineToEdit.lineLyrics}
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
          <button
            className="verse__btns-save"
            onClick={handleSave}
            disabled={lineToEdit !== null}
          >
            Save
          </button>
          <button
            className="verse__btns-clear"
            onClick={() => {
              setLines([]);
              setInputDisabled(false);
            }}
            disabled={lineToEdit !== null}
          >
            clear
          </button>
        </div>
      )}
    </div>
  );
};

export default Verse;
