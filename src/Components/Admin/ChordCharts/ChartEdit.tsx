import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChartRequest, { apiEndpoints } from "../../../API/ChartRequest";
import ChordRequest from "../../../API/ChordRequest";
import axios from "axios";
import { RiAddCircleFill } from "react-icons/ri";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
  ChartEditModel,
  ChartEditSchema,
} from "../../../DataModels/ChartModel";
import { ChordModel, ChordSchema } from "../../../DataModels/ChordModel";
import { idSchema } from "../../../DataModels/ValidateID";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "../../../API/API";
import ChartPreview from "./ChartPreview";
import AudioPreview from "./AudioPreview";

const ChartEdit = () => {
  const {
    register,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChartEditModel>({
    mode: "all",
    resolver: zodResolver(ChartEditSchema),
  });
  const [chartData, setChartData] = useState<ChartEditModel>({
    id: 0,
    filePath: "",
    chordId: 1,
    fretPosition: 1,
    chartUpload: null,
    chartAudioUpload: null,
    chartAudioFilePath: "",
    positionDescription: "",
  });

  const [chord, setChord] = useState<ChordModel>();
  const [chordChange, setChordChange] = useState<ChordModel[]>([]);
  const [errorResult, setErrorResult] = useState([]);
  const [chartPreview, setChartPreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");

  const { id } = useParams();
  const exit = useNavigate();

  useEffect(() => {
    const getChart = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await ChartRequest.fetchSpecificChordChart(
          validatedId
        );

        const chartResult = ChartEditSchema.safeParse(response.data);

        if (!chartResult.success) {
          console.error(
            "🚀 ~ getChart ~ chartResult.error:",
            chartResult.error
          );
          return;
        }
        setChartData(chartResult.data);

        if (chartResult.data) {
          chartResult.data.filePath &&
            setChartPreview(chartResult.data.filePath);
          chartResult.data.chartAudioFilePath &&
            setAudioPreview(chartResult.data.chartAudioFilePath);
          chartResult.data.chordId &&
            setChord(
              chordChange.find((ch) => ch.id === chartResult.data.chordId)
            );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getChart();
  }, [id]);

  useEffect(() => {
    setValue("id", chartData.id);
    setValue("filePath", chartData.filePath);
    if (chartData.filePath) {
      setChartPreview(chartData.filePath);
    }
    setValue("chordId", chartData.chordId);
    setValue("fretPosition", chartData.fretPosition);

    const chartAudio = chartData.chartAudioFilePath;
    if (chartAudio) {
      const audioFile = chartAudio.split("/").pop();

      setValue("chartAudioFilePath", audioFile);
    }
    setValue("positionDescription", chartData.positionDescription);
  }, [chartData]);

  useEffect(() => {
    const chordSelect = async () => {
      try {
        if (chartData.chordId !== null) {
          const response = await ChordRequest.fetchChordById(chartData.chordId);

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
  }, [chartData.chordId]);

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
    //clear previous states
    setValue("chartUpload", null);
    setValue("filePath", "");
    setChartPreview("");
    setError("chartUpload", {});

    const chartFile = e.target.files?.[0];
    if (chartFile && chartFile.type.substr(0, 5) === "image") {
      const chartReader = new FileReader();
      chartReader.onload = () => {
        setValue("chartUpload", chartFile);
        setValue("filePath", chartFile.name);

        setChartPreview(chartReader.result as string);
      };
      chartReader.onerror = (error) => {
        console.log("filereadingError: ", error);
      };
      chartReader.readAsDataURL(chartFile);
    } else {
      setValue("chartUpload", null);
      setValue("filePath", "");
      setChartPreview("");
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // clear previous state
    setValue("chartAudioUpload", null);
    setValue("chartAudioFilePath", "");
    setAudioPreview("");

    const audioFile = e.target.files?.[0];
    if (audioFile) {
      const audioReader = new FileReader();
      audioReader.onload = () => {
        setValue("chartAudioUpload", audioFile);
        setValue("chartAudioFilePath", audioFile.name);

        setAudioPreview(audioReader.result as string);
      };
      audioReader.readAsDataURL(audioFile);
    } else {
      setValue("chartAudioUpload", null);
      setValue("chartAudioFilePath", "");
      setAudioPreview("");
    }
  };

  const handleRemoveFile = () => {
    // Clear file input value and form state
    setValue("chartUpload", null);
    setValue("filePath", "");
    setChartPreview("");

    // Reset file input field (if needed)
    const inputElement = document.getElementById(
      "inputGroupFile01"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const handleRemoveAudioFile = () => {
    // Clear file input value and form state
    setValue("chartAudioUpload", null);
    setValue("chartAudioFilePath", "");
    setAudioPreview("");

    // Reset file input field (if needed)
    const inputElement = document.getElementById(
      "inputGroupFile02"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = "";
    }
  };

  const onSubmit = async (data: ChartEditModel) => {
    const formData = new FormData();

    formData.append("id", id as string);
    formData.append(
      "chordId",
      data.chordId !== null ? data.chordId.toString() : ""
    );
    formData.append("fretPosition", data.fretPosition.toString());

    formData.append("positionDescription", data.positionDescription || "");
    if (data.chartUpload) {
      formData.append("filePath", data.chartUpload.name);
      formData.append("chartUpload", data.chartUpload);
    } else {
      formData.append("filePath", data.filePath as string);
      formData.append("chartUpload", "");
    }
    if (data.chartAudioUpload) {
      formData.append("chartAudioFilePath", data.chartAudioUpload.name);
      formData.append("chartAudioUpload", data.chartAudioUpload);
    } else {
      formData.append("chartAudioFilePath", data.chartAudioFilePath as string);
      formData.append("chartAudioUpload", "");
    }

    console.log("Form Data Entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    console.log(data);
    try {
      const validatedId = idSchema.parse(id);

      const response = await API.put(
        apiEndpoints.editChordChart(validatedId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("🚀 ~ onSubmit ~ response:", response);

      if (response && response.status === 200) {
        const fileName = data.filePath && data.filePath.split("_").pop();
        exit("/admin/chordcharts", {
          state: {
            successMessage: `chord chart ${fileName} edited successfully`,
          },
        });
      }
    } catch (error) {
      setError("root", {
        message: `Unexpected Errror occured! Try Again!`,
      });
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h3 className="mb-3">Edit chart</h3>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 d-flex justify-content-between">
              <label htmlFor="chord">Chord:</label>
              <div className="w-75 d-flex flex-column mb-2">
                <div
                  className="w-100 d-flex justify-content-between "
                  style={{ width: "75%" }}
                >
                  <select
                    className="form-select flex-fill me-3"
                    {...register("chordId", { setValueAs: (v) => parseInt(v) })}
                  >
                    <option value={chord?.id}>{chord?.chordName}</option>
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
                {errors.chordId && (
                  <p className="text-danger text-sm">
                    {errors.chordId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-2 d-flex justify-content-between">
              <label htmlFor="fret">Fret:</label>
              <div className="w-75 d-flex flex-column mb-2">
                <input
                  type="number"
                  className="w-100 form-control"
                  style={{ width: "75%" }}
                  {...register("fretPosition", {
                    setValueAs: (v) => parseInt(v),
                  })}
                />
                {errors.fretPosition && (
                  <p className="text-danger text-sm">
                    {errors.fretPosition.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-2 d-flex justify-content-between">
              <label htmlFor="file">
                <strong className="fs-5">File:</strong>
              </label>
              <div className="w-75 d-flex flex-column mb-2">
                <div className="w-100 input-group mb-2">
                  <input
                    type="file"
                    id="inputGroupFile01"
                    className="form-control flex-fill border btn btn-outline-light"
                    accept="image/*"
                    onChange={handleChartUpload}
                  />
                </div>
                <ChartPreview
                  chartPreview={chartPreview}
                  handleRemoveFile={handleRemoveFile}
                />

                {errors.chartUpload && (
                  <p className="text-danger text-sm">
                    {errors.chartUpload.message}
                  </p>
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
                  className="form-control flex-fill border btn btn-outline-light m-2"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                />
                <AudioPreview
                  handleRemoveAudioFile={handleRemoveAudioFile}
                  audioPreview={audioPreview}
                />
                {errors.chartAudioUpload && (
                  <p className="text-danger text-sm">
                    {errors.chartAudioUpload.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="description">Description:</label>
              <div className="w-75 d-flex flex-column ">
                <textarea
                  className="w-100 form-control overflow-scroll"
                  placeholder="Describe here..."
                  {...register("positionDescription")}
                ></textarea>
                {errors.positionDescription && (
                  <p className="text-danger text-sm">
                    {errors.positionDescription.message}
                  </p>
                )}
              </div>
            </div>
            <pre>
              {JSON.stringify(
                watch(),
                (key, value) => {
                  if (value instanceof File) {
                    return value.type;
                  }
                  return value;
                },
                2
              )}
            </pre>
            <div className="d-flex justify-content-end ms-2 mb-3">
              <Link
                to="/admin/chordcharts"
                className="btn btn-outline-danger me-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-outline-primary "
                disabled={isSubmitting}
              >
                Edit
              </button>
            </div>
            {errors.root && (
              <p className="text-danger text-sm">{errors.root.message}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChartEdit;
