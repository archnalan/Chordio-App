import React, { useEffect, useState } from "react";
import Verse from "../Input/Verse";
import "./SelectInput.css";
import "./HymnFetch";
import { fetchAllHymns } from "./HymnFetch";
import { HymnSchema, HymnModel } from "../../../DataModels/HymnModel";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import { VerseModel } from "../../../DataModels/VerseModel";
import { LineModel } from "../../../DataModels/LineModel";
import { VerseContext } from "../../Contexts/VerseContext";
import { ChordModel } from "../../../DataModels/ChordModel";
import { SegmentModel } from "../../../DataModels/SegmentModel";
import axios from "axios";
import { PayLoadSchema } from "./PayLoadModel";

const SectionInput: React.FC = () => {
  const [hymns, setHymns] = useState<HymnModel[]>([]);
  const [verse, setVerse] = useState<VerseModel>({
    number: 1,
    hymnId: 0,
    lyrics: "",
  });
  const [lines, setLines] = useState<LineModel[]>([]);
  const [segments, setSegments] = useState<SegmentModel[]>([]);
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  useEffect(() => {
    const getHymns = async () => {
      try {
        const response = await fetchAllHymns();
        console.log("🚀 ~ useEffect ~ response:", response);

        const validatedHymn = HymnSchema.array().safeParse(
          response.data.$values
        );

        if (!validatedHymn.success) {
          console.error(
            "🚀 ~ getHymns ~ validatedHymn.success:",
            validatedHymn.error
          );
          return;
        }

        console.log(
          "🚀 ~ getHymns ~ validatedHymn.success:",
          validatedHymn.data
        );

        setHymns(validatedHymn.data);

        setVerse((prevVerse) => ({
          ...prevVerse,
          hymnId: validatedHymn.data[0].id,
        }));
      } catch (error) {
        console.error("Error fetching Hymns", error);
      }
    };
    getHymns();
  }, []);

  const handleVerse = (e: React.MouseEvent) => {
    e.preventDefault();

    if (verse.lyrics !== "") {
      let lyricLines = verse.lyrics.trim().split("\n");

      let newLines = lyricLines.map((line, index) => ({
        lyricLineOrder: index + 1,
        verseId: verse.hymnId,
        lineLyrics: line,
      }));
      console.log("🚀 ~ newLines ~ newLines:", newLines);

      setLines(newLines);
      setVerse((prevVerse) => ({ ...prevVerse, lyrics: "" })); // clear text area after submission
      setInputDisabled(true);
    }
  };

  const handleHymnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHymn = hymns.find(
      (hymn) => hymn.id === parseInt(e.target.value)
    );

    if (selectedHymn) {
      setVerse((prevVerse) => ({ ...prevVerse, hymnId: selectedHymn.id }));
    }
  };

  const handleVerseNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerse((prevVerse) => ({
      ...prevVerse,
      number: parseInt(e.target.value),
    }));
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const payload = {
        verseCreate: {
          number: verse.number,
          hymnId: verse.hymnId,
        },

        linesCreate: lines.map((line) => ({
          lyricLineOrder: line.lyricLineOrder,
          verseId: line.verseId,
        })),

        segmentsCreate: segments,

        chordsCreate: chords,
      };

      console.log("🚀 ~ handleSave ~ payload:", payload);

      const validationResult = PayLoadSchema.safeParse(payload);

      if (!validationResult.success) {
        console.error(
          "🚀 ~ handleSave ~ validationResult.success:",
          validationResult.error
        );
      }

      const response = axios.post(
        "https://localhost:7077/api/verses/create",
        payload,
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );

      console.log("🚀 ~ handleSave ~ response:", response);
    } catch (error) {
      console.error("Error Saving verse", error);
    }
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ chords:", chords);
  }, [chords]);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ SEGMENTS:", segments);
  }, [segments]);

  return (
    <>
      <VerseContext.Provider
        value={{ lines, setLines, segments, setSegments, chords, setChords }}
      >
        <div className="hymn__select">
          <select className="hymn__select-title" onChange={handleHymnChange}>
            {hymns.map((hymn) => (
              <option key={hymn.id} value={hymn.id}>
                {hymn.title}
              </option>
            ))}
          </select>

          <div
            className="verse__number btn-group"
            role="group"
            aria-label="Basic radio togle button group"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num}>
                <input
                  type="radio"
                  className="btn-check"
                  name="btnradio"
                  id={`btnradio${num}`}
                  autoComplete="off"
                  checked={verse.number === num}
                  onChange={handleVerseNumChange}
                  value={num}
                />
                <label
                  htmlFor={`btnradio${num}`}
                  className="btn btn-outline-primary"
                >
                  Verse {num}
                </label>
              </div>
            ))}
          </div>
          <div className="hymn__verse">
            <Verse
              setInputDisabled={setInputDisabled}
              handleSave={handleSave}
            />
          </div>
          <div className="verse__input">
            <textarea
              className="verse__inputbox"
              placeholder={`${inputDisabled ? "" : "Enter Verse here..."}`}
              value={verse.lyrics} //bind content to verse State
              onChange={(e) => {
                setVerse((prevVerse) => ({
                  ...prevVerse,
                  lyrics: e.target.value,
                }));
              }}
              disabled={inputDisabled}
            ></textarea>
            <button
              type="submit"
              className="verse__btnSubmit"
              onClick={handleVerse}
              disabled={inputDisabled}
            >
              <LuArrowUpLeftSquare
                className={` ${inputDisabled ? "upload:disabled" : "upload"}`}
              />
            </button>
          </div>
        </div>
      </VerseContext.Provider>
    </>
  );
};

export default SectionInput;
