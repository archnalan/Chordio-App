import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChartRequest from "../../../API/ChartRequest";
import ChordRequest from "../../../API/ChordRequest";
import axios from "axios";
import { RiAddCircleFill } from "react-icons/ri";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { ChartModel, ChartSchema } from "../../../DataModels/ChartModel";
import { ChordModel, ChordSchema } from "../../../DataModels/ChordModel";
import { idSchema } from "../../../DataModels/ValidateID";

const ChartEdit = () => {
  const [chart, setChart] = useState<ChartModel>({
    id: 0,
    filePath: "",
    /* chartUpload: null, */
    chordId: 1,
    fretPosition: 1,
    chartAudioFilePath: "",
    /* chartAudioUpload: null, */
    positionDescription: "",
  });

  const [chord, setChord] = useState("");
  const [chordChange, setChordChange] = useState<ChordModel[]>([]);
  const [errorResult, setErrorResult] = useState([]);
  const [chartPreview, setChartPreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getChart = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await ChartRequest.fetchSpecificChordChart(
          validatedId
        );

        const chartResult = ChartSchema.safeParse(response.data);

        if (!chartResult.success) {
          console.error(
            "🚀 ~ getChart ~ chartResult.error:",
            chartResult.error
          );
          return;
        }
        setChart(chartResult.data);

        if (response.data) {
          setChartPreview(response.data.filePath);
          setAudioPreview(response.data.chartAudioFilePath);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getChart();
  }, [id]);

  useEffect(() => {
    const chordSelect = async () => {
      try {
        if (chart.chordId !== null) {
          const response = await ChordRequest.fetchChordById(chart.chordId);

          const chordResult = ChordSchema.safeParse(response.data);

          if (!chordResult.success) {
            console.error(
              "🚀 ~ chordSelect ~ chordResult.error:",
              chordResult.error
            );
            return;
          }

          setChord(chordResult.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    chordSelect();
  }, [chart.chordId]);

  useEffect(() => {
    const chordsSelect = async () => {
      try {
        const response = await ChordRequest.fetchAllChords();
        const chordResults = ChordSchema.array().safeParse(
          response.data.$values
        );
        if (!chordResults.success) {
          console.error(
            "🚀 ~ chordsSelect ~ chordResults.error:",
            chordResults.error
          );
          return;
        }
        setChordChange(chordResults.data);
      } catch (error) {
        console.error(error);
      }
    };
    chordsSelect();
  }, []);

  const handleChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chartFile = e.target.files[0];
    if (chartFile && chartFile.type.substr(0, 5) === "image") {
      const chartReader = new FileReader();
      chartReader.onload = () => {
        setChart((prevChart) => ({
          ...prevChart,
          chartUpload: chartFile,
          filePath: chartFile.name,
        }));
        setChartPreview(chartReader.result);
      };
      chartReader.onerror = (error) => {
        console.log("filereadingError: ", error);
      };
      chartReader.readAsDataURL(chartFile);
    } else {
      setChart((prevChart) => ({
        ...prevChart,
        chartUpload: null,
        filePath: "",
      }));
      setChartPreview("");
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioFile = e.target.files[0];
    if (audioFile) {
      const audioReader = new FileReader();
      audioReader.onload = () => {
        setChart((prevChart) => ({
          ...prevChart,
          chartAudioUpload: audioFile,
          chartAudioFilePath: audioFile.name,
        }));
        setAudioPreview(audioReader.result);
      };
      audioReader.readAsDataURL(audioFile);
    } else {
      setChart((prevChart) => ({
        ...prevChart,
        chartAudioUpload: null,
        chartAudioFilePath: "",
      }));
      setAudioPreview("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editData();
  };

  const editData = async () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("filePath", chart.filePath);
    formData.append("chordId", chart.chordId);
    formData.append("fretPosition", chart.fretPosition);
    formData.append("chartAudioFilePath", chart.chartAudioFilePath);
    formData.append("positionDescription", chart.positionDescription);
    if (chart.chartUpload) {
      formData.append("chartUpload", chart.chartUpload);
    } else {
      formData.append("chartUpload", null);
    }
    if (chart.chartAudioUpload) {
      formData.append("chartAudioUpload", chart.chartAudioUpload);
    } else {
      formData.append("chartAudioUpload", null);
    }

    console.log("Form Data Entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    console.log(chart);
    try {
      const response = await axios.put(
        `${Requests.editChordChart}${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      navigate("/admin/chordcharts", {
        state: {
          successMessage: `Chart  ${chart.filePath} Updated Successfully!`,
        },
      });
    } catch (error) {
      /* setErrorResult(error.response.data); */
      console.error("Error editing Chart: ", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h3 className="mb-3">Edit chart</h3>
        {errorResult && (
          <p className="w-100 text-danger text-wrap">{errorResult}</p>
        )}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-2 d-flex justify-content-between">
              <label htmlFor="chord">Chord:</label>
              <div
                className="d-flex justify-content-between "
                style={{ width: "75%" }}
              >
                <select
                  className="form-select flex-fill me-3"
                  onChange={(e) =>
                    setChart({ ...chart, chordId: e.target.value })
                  }
                >
                  <option value={chord.Id}>{chord.chordName}</option>
                  {chordChange &&
                    chordChange.map((chordNew, index) => (
                      <option key={index} value={chordNew.id}>
                        {chordNew.chordName}
                      </option>
                    ))}
                </select>
                <Link
                  to="/admin/chords/create"
                  className="btn btn-info flex-fill position-relative"
                >
                  Chord
                  <RiAddCircleFill className="position-absolute top-50 start-0 translate-middle bg-info rounded-5" />
                </Link>
              </div>
            </div>
            <div className="mb-2 d-flex justify-content-between">
              <label htmlFor="fret">Fret:</label>
              <input
                type="number"
                name="fret"
                className="form-contol "
                value={chart.fretPosition}
                style={{ width: "75%" }}
                onChange={(e) =>
                  setChart({ ...chart, fretPosition: e.target.value })
                }
              />
            </div>
            <div className="mb-2 d-flex justify-content-between">
              <label htmlFor="file">
                <strong className="fs-5">File:</strong>
              </label>
              <div className="w-75 d-flex flex-column">
                <div className="input-group mb-2" style={{ width: "100%" }}>
                  <input
                    type="file"
                    id="inputGroupFile01"
                    className="form-contol flex-fill border btn btn-outline-light"
                    accept="image/*"
                    onChange={handleChartUpload}
                  />
                </div>
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
                      onClick={() => setChartPreview("")}
                      style={{ background: "transparent", border: "none" }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "0",
                          left: "0",
                          fontSize: "1.2em",
                        }}
                      >
                        <IoMdCloseCircleOutline />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="audio">
                <strong className="fs-5">Audio:</strong>
              </label>
              <div className="d-flex flex-column" style={{ width: "75%" }}>
                <input
                  type="file"
                  name="audio"
                  className="form-contol flex-fill border btn btn-outline-light m-2"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                />
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
                      onError={(error) =>
                        console.error("Error playing audio: ", error)
                      }
                    >
                      <source src={audioPreview} />
                      Your Browser does not support this audio
                    </audio>
                    <button
                      onClick={() => setAudioPreview("")}
                      style={{ background: "transparent", border: "none" }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          fontSize: "1.2em",
                        }}
                      >
                        <IoMdCloseCircleOutline />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="description">Description:</label>
              <textarea
                type="text"
                name="description"
                value={chart.positionDescription}
                className="form-contol overflow-scroll"
                placeholder="Describe here..."
                style={{ width: "75%" }}
                onChange={(e) =>
                  setChart({ ...chart, positionDescription: e.target.value })
                }
              ></textarea>
            </div>
            <div className="d-flex justify-content-end ms-2 mb-3">
              <Link to="/admin/chordcharts" className="btn btn-danger me-3">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary ">
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChartEdit;
