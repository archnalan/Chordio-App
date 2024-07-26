import React, { useEffect, useState } from "react";
import Verse from "../Input/Verse";
import "./SelectInput.css";
import "./HymnFetch";
import { fetchAllHymns } from "./HymnFetch";
import { Hymn } from "./HymnModel";
import { LuArrowUpLeftSquare } from "react-icons/lu";
import { VerseModel } from "./VerseModel";
import { LineModel } from "./LineModel";

const SectionInput: React.FC = () => {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [verse, setVerse] = useState<VerseModel>({
    number: 0,
    hymnId: 0,
    linesCreate: [],
    segmentsCreate: [],
    lyrics: "",
  });
  const [lines, setLines] = useState<LineModel[]>([]);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  useEffect(() => {
    const getHymns = async () => {
      try {
        const response = await fetchAllHymns();
        console.log("🚀 ~ useEffect ~ response:", response);
        if (response.data.$values.length > 0) {
          setHymns(response.data.$values);
          setVerse((prevVerse) => ({
            ...prevVerse,
            hymnId: response.data.$values[0].id,
          }));
        }
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
        segments: line,
      }));

      setLines(newLines);
      setVerse((prevVerse) => ({ ...prevVerse, lyrics: "" })); // clear text area after submission
      setInputDisabled(true);
    }
  };
  useEffect(() => {
    console.log("🚀 ~ handleHymnChange ~ verse:", verse);
    console.log("split lines", lines);
  }, [lines]);

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
    console.log("🚀 ~ setVerse ~ e.target.value:", e.target.value);
  };

  return (
    <>
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
            lines={lines}
            verse={verse}
            setLines={setLines}
            setInputDisabled={setInputDisabled}
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
    </>
  );
};

export default SectionInput;
