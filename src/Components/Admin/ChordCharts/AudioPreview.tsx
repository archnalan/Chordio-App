import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

type AudioProps = {
  audioPreview: string;
  handleRemoveAudioFile: () => void;
};

const AudioPreview: React.FC<AudioProps> = ({
  audioPreview,
  handleRemoveAudioFile,
}) => {
  return (
    <div>
      {audioPreview && (
        <div
          style={{
            position: "relative",
          }}
        >
          <audio
            controls
            style={{
              maxWidth: "100%",
              maxHeight: "5em",
              objectFit: "contain",
            }}
            className="m3"
          >
            <source src={audioPreview} />
            Your Browser does not support this audio
          </audio>
          <button
            onClick={handleRemoveAudioFile}
            style={{ background: "transparent", border: "none" }}
          >
            <span
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                fontSize: "1.2em",
                color: "red",
              }}
            >
              <IoMdCloseCircleOutline />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioPreview;
