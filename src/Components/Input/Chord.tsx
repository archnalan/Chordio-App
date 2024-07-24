import React, {
  useState,
  forwardRef,
  FormEvent,
  ChangeEvent,
  MouseEvent,
} from "react";
import "./Chord.css";
import ChordSelect from "./ChordSelect";

type Props = {
  inputFocus: () => void;
  ref: RefObject<HTMLInputElement>;
};

const Chord = forwardRef<HTMLInputElement, Props>(({ inputFocus }, ref) => {
  const [chord, setchord] = useState<string>("");
  const [chordError, setChordError] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setchord(e.target.value);
  };
  const handleChordInput = (e: FormEvent<EventTarget>) => {
    e.preventDefault();

    const addedChord = chord.trim();

    const chordRegex =
      /^([A-G])(#|b|##|bb)?(m|maj|min|dim|aug|M7|maj7|m7|7|sus2|sus4|add\d+|6|9|11|13|dim7|m6|m9|m11|m13|maj9|maj11|maj13)?(\/[A-G](#|b)?)?$/;

    if (addedChord.match(chordRegex)) {
      console.log(chord);
      setchord(chord);

      (ref as React.RefObject<HTMLInputElement>).current?.blur();
    } else {
      console.error("Error: " + chord + " is Invalid chord");
      setChordError(chord + " is Invalid Chord");
    }
  };

  const handleRevision = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setChordError("");
    (ref as React.RefObject<HTMLInputElement>).current?.focus();
  };

  return (
    <div className="chord">
      <strong className="chord__bolden">
        {chordError ? (
          <div className="chord__error">
            <button className="chord__error-btn" onClick={handleRevision}>
              ?
            </button>

            <div className="chord__display">
              <p>{chordError}</p>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleChordInput}>
              <input
                ref={ref}
                className="chord__input"
                placeholder="C#"
                onChange={handleInputChange}
              />
            </form>
            {/* <ChordSelect /> */}
          </>
        )}
      </strong>
    </div>
  );
});
export default Chord;
