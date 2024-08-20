import React, { useEffect, useState } from "react";
import ChordRequest from "../../../API/ChordRequest";
import { Link, useNavigate } from "react-router-dom";
import { RiAddCircleFill } from "react-icons/ri";
import { ChordModel, ChordSchema } from "../../../DataModels/ChordModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChartCreateModel,
  ChartCreateSchema,
} from "../../../DataModels/ChartModel";
import AudioPreview from "./AudioPreview";
import ChartPreview from "./ChartPreview";
import { apiEndpoints } from "../../../API/ChartRequest";
import API from "../../../API/API";

const ChartCreate: React.FC = () => {
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [chartPreview, setChartPreview] = useState("");
  const [audioPreview, setAudioPreview] = useState("");

  const exit = useNavigate();

  const {
    register,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    reset,
  } = useForm<ChartCreateModel>({
    mode: "all",
    defaultValues: {
      fretPosition: 1,
    },
    resolver: zodResolver(ChartCreateSchema),
  });

  useEffect(() => {
    const chordFetch = async () => {
      try {
        const response = await ChordRequest.fetchAllChords();

        const chordResult = ChordSchema.array().safeParse(
          response.data.$values
        );

        if (!chordResult.success) {
          console.error(
            "🚀 ~ chordFetch ~ chordResult.errors:",
            chordResult.error.issues
          );
          return;
        }
        if (chordResult.data.length > 0) {
          setChords(chordResult.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    chordFetch();
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
      //clear the previousUpload
      setValue("chartUpload", null);
      setValue("filePath", "");
      //Hides Preview
      setChartPreview("");
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // clear previous state
    setValue("chartAudioUpload", null);
    setValue("chartAudioFilePath", "");
    setAudioPreview("");
    setError("chartUpload", {});

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

  const onSubmit = async (data: ChartCreateModel) => {
    const formData = new FormData();

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
    console.log(data);

    const validateChart = ChartCreateSchema.safeParse(data);
    if (!validateChart.success) {
      console.error(
        "🚀 ~ onSubmit ~ validateChart.error:",
        validateChart.error
      );
    }

    try {
      const response = await API.post(apiEndpoints.createChordChart, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("🚀 ~ onSubmit ~ response:", response);

      if (response && response.status === 201) {
        exit("/admin/chordcharts", {
          state: {
            successMessage: `chord chart ${data.filePath} created successfully`,
          },
        });
      } else {
        setError("root", { message: `${response.data}` });
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error.response.data);
      setError("root", { message: `${error.message}` });
      console.error("Error posting data: ", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h1 className="mb-4">Create a chart</h1>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column"
          >
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="chord">
                <strong className="fs-5">Chord:</strong>
              </label>
              <div className="w-75 d-flex flex-column">
                <div className=" d-flex justify-content-between mb-2">
                  <select
                    className="form-select flex-fill me-3"
                    {...register("chordId", {
                      setValueAs: (v) => parseInt(v),
                    })}
                  >
                    <option value="">Pick a Chord</option>
                    {chords &&
                      chords.map((chord, index) => (
                        <option key={index} value={chord.id}>
                          {chord.chordName}
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
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="fret">
                <strong className="fs-5"> Fret</strong>
              </label>
              <div className="w-75 d-flex flex-column">
                <input
                  type="number"
                  className="form-contol btn btn-outline-secondary"
                  {...register("fretPosition", {
                    setValueAs: (v) => parseInt(v),
                  })}
                  min={1}
                  step={1}
                  max={24}
                />
                {errors.fretPosition && (
                  <p className="text-danger text-sm">
                    {errors.fretPosition.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="file">
                <strong className="fs-5">File</strong>{" "}
              </label>
              <div className="w-75 d-flex flex-column mb-2">
                <div className="input-group ">
                  <input
                    type="file"
                    id="inputGroupFile01"
                    className="form-control mb-2"
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
                <strong className="fs-5">Audio</strong>
              </label>
              <div className="w-75 d-flex flex-column mb-2">
                <div className="input-group">
                  <input
                    type="file"
                    id="inputGroupFile01"
                    className="form-control mb-2"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                  />
                </div>
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
              <label htmlFor="description">
                <strong className="fs-5"> Description</strong>
              </label>
              <div className="w-75 d-flex flex-column ">
                <textarea
                  id="floatingTextarea2"
                  className="form-control overflow-scroll"
                  placeholder="Describe here..."
                  style={{ width: "75%", height: "100px" }}
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
              <Link to="/admin/chordcharts" className="btn btn-danger me-3">
                <button className="btn btn-danger " disabled={isSubmitting}>
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="btn btn-primary "
                disabled={isSubmitting}
              >
                Create
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

export default ChartCreate;
