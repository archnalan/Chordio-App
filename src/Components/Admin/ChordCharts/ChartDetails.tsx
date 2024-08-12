import React, { useEffect, useState } from "react";
import ChordRequest from "../../../API/ChordRequest";
import ChartRequest from "../../../API/ChartRequest";
import { Link, useParams } from "react-router-dom";
import { ChartModel, ChartSchema } from "../../../DataModels/ChartModel";
import { ChordSchema } from "../../../DataModels/ChordModel";
import { idSchema } from "../../../DataModels/ValidateID";

const ChartDetails: React.FC = () => {
  const [chart, setChart] = useState<ChartModel>({
    id: 0,
    filePath: "",
    chordId: null,
    fretPosition: 0,
    chartAudioFilePath: "",
    positionDescription: "",
  });
  const [chartPreview, setChartPreview] = useState("");
  const [chord, setChord] = useState("");
  const [audioPreview, setAudioPreview] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    console.log("🚀 ~ ChartDetails ~ chart:", chart);
  }, [chart]);

  const { id } = useParams();

  useEffect(() => {
    const GetChart = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await ChartRequest.fetchSpecificChordChart(
          validatedId
        );

        const chartResult = ChartSchema.safeParse(response.data);

        if (!chartResult.success) {
          console.error(
            "🚀 ~ GetChart ~ chartResult.error",
            chartResult.error.issues
          );
          return;
        }
        console.log("🚀 ~ GetChart ~ the filePath", chartResult.data);
        setChart(chartResult.data);

        setChartPreview(chartResult.data.filePath);
        setAudioPreview(chartResult.data.chartAudioFilePath);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    GetChart();
  }, [id]);

  useEffect(() => {
    if (chart && chart.chordId) {
      const GetChord = async () => {
        try {
          if (chart.chordId !== null) {
            const response = await ChordRequest.fetchChordById(chart.chordId);

            const chordResult = ChordSchema.safeParse(response.data);
            if (!chordResult.success) {
              console.error(
                "🚀 ~ GetChord ~ chordResult.error:",
                chordResult.error.issues
              );
              return;
            }
            setChord(chordResult.data.chordName);
          }
        } catch (error) {
          console.error("Error getting Chord", error);
        }
      };
      GetChord();
    }
  }, [chart]);

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white px-5 pt-3 pb-3 rounded">
        <h3>Chord Chart Details</h3>
        <div className="d-flex justify-content-between text-end mb-3">
          <strong>Chord:</strong>
          <span>{chord}</span>
        </div>
        <div className="d-flex justify-content-between text-end mb-3">
          <strong>Fret:</strong>
          <span>{chart.fretPosition}</span>
        </div>
        <div className="d-flex justify-content-between text-end mb-3">
          <strong>File:</strong>
          <img
            src={chartPreview}
            alt="chart preview"
            style={{
              maxWidth: "20em",
              maxHeight: "10em",
              objectFit: "contain",
            }}
          />
        </div>
        <div className="d-flex justify-content-between text-end mb-3">
          <strong>Audio:</strong>
          <audio
            controls
            style={{
              maxWidth: "100%",
              maxHeight: "5em",
              objectFit: "contain",
            }}
            className="m3"
            src={audioPreview}
          >
            Your Browser does not support this audio
          </audio>
        </div>
        <div className="d-flex justify-content-between text-end mb-3">
          <strong>Description:</strong>
          <span>{chart.positionDescription}</span>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <Link to={"/admin/chordcharts"} className="btn btn-danger me-2">
            Back
          </Link>
          <Link
            to={`/admin/chordcharts/edit/${id}`}
            className="btn btn-primary"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChartDetails;
