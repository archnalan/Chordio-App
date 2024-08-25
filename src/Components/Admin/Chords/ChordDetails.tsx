import React, { useEffect, useState } from "react";
import ChordRequest from "../../../API/ChordRequest";
import ChartRequest from "../../../API/ChartRequest";
import { Link, useParams } from "react-router-dom";
import { ChartModel, ChartSchema } from "../../../DataModels/ChartModel";
import {
  ChordEditModel,
  ChordModel,
  ChordSchema,
} from "../../../DataModels/ChordModel";
import { idSchema } from "../../../DataModels/ValidateID";
import { TbArrowBigLeft } from "react-icons/tb";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const ChordDetails: React.FC = () => {
  const [chord, setChord] = useState<ChordEditModel>({
    id: 0,
    chordName: "",
    difficulty: 0,
    chartAudioFilePath: "",
    chartAudioUpload: null,
  });
  const [charts, setCharts] = useState<ChartModel[]>([]);
  const [audioPreview, setAudioPreview] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    console.log("🚀 ~ ChartDetails ~ chart:", chord);
  }, [chord]);

  const { id } = useParams();

  useEffect(() => {
    const GetChord = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await ChordRequest.fetchChordById(validatedId);

        const chordResult = ChordSchema.safeParse(response.data);

        if (!chordResult.success) {
          console.error(
            "🚀 ~ GetChord ~ chordResult.error",
            chordResult.error.issues
          );
          return;
        }
        console.log("🚀 ~ GetChord ~ the filePath", chordResult.data);
        setChord(chordResult.data);

        /* setChartPreview(chordResult.data.filePath);
        setAudioPreview(chordResult.data.chartAudioFilePath); */
      } catch (error) {
        console.error("Error:", error);
      }
    };
    GetChord();
  }, [id]);

  useEffect(() => {
    const FetchCharts = async () => {
      try {
        const response = await ChartRequest.fetchAllChordCharts();

        const validateCharts = ChartSchema.array().safeParse(
          response.data.$values
        );
        if (!validateCharts.success) {
          console.error(
            "🚀 ~ FetchData ~ validateCharts.success:",
            validateCharts.error.issues
          );
          return;
        }
        setCharts(validateCharts.data);
      } catch (error) {
        console.error(error);
      }
    };
    FetchCharts();
  }, []);

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white px-5 pt-3 pb-3 rounded">
        <div className="d-flex align-items-center mb-4">
          <Link
            to={"/admin/chords"}
            className="text-danger hover:text-dark me-4"
          >
            <TbArrowBigLeft />
          </Link>
          <h3>
            <strong>Chord Details</strong>
          </h3>
        </div>
        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Chord</strong>
          <span>{chord.chordName}</span>
        </div>
        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Version</strong>
          <span>{chord.difficulty}</span>
        </div>
        <div className="d-flex flex-column justify-content-start mb-3">
          <strong className="mb-2">Charts</strong>

          <div id="carouselCharts" className="carousel slide">
            <div className="carousel-inner">
              {charts
                .filter((chart) => chart.chordId === chord.id)
                .map((chart, chartIndex) => (
                  <div
                    key={chart.id}
                    className={`carousel-item ${
                      chartIndex === 0 ? "active" : ""
                    }`}
                  >
                    <img
                      src={chart.filePath}
                      alt={chord.chordName}
                      className="d-block w-100 card-img-top  img-thumbnail mb-2"
                      style={{
                        maxWidth: "25em",
                        maxHeight: "15em",
                        objectFit: "contain",
                      }}
                    />
                    <h6 className="d-block text-center text-secondary ">
                      Fret {chart.fretPosition}
                    </h6>
                  </div>
                ))}
            </div>
            {charts.filter((chart) => chart.chordId === chord.id).length >
              0 && (
              <div>
                <button
                  className="carousel-control-prev text-dark"
                  type="button"
                  data-bs-target="#carouselCharts"
                  data-bs-slide="prev"
                >
                  <MdOutlineNavigateBefore size={24} />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next text-dark"
                  type="button"
                  data-bs-target="#carouselCharts"
                  data-bs-slide="next"
                >
                  <MdOutlineNavigateNext size={24} />
                  <span className="visually-hidden">Next</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselCharts"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Link to={"/admin/chords"} className="btn btn-outline-danger me-2">
            Back
          </Link>
          <Link
            to={`/admin/chords/edit/${id}`}
            className="btn btn-outline-primary"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChordDetails;
