import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

type ChartPrevProps = {
  chartPreview: string;
  handleRemoveFile: () => void;
};
const ChartPreview: React.FC<ChartPrevProps> = ({
  chartPreview,
  handleRemoveFile,
}) => {
  return (
    <div>
      {chartPreview && (
        <div
          style={{
            position: "relative",
          }}
        >
          <img
            src={chartPreview}
            alt="chart preview"
            style={{
              maxWidth: "20em",
              maxHeight: "10em",
              objectFit: "contain",
            }}
          />
          <button
            onClick={handleRemoveFile}
            style={{ background: "transparent", border: "none" }}
          >
            <span
              style={{
                position: "absolute",
                top: "0",
                left: "0",
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

export default ChartPreview;
