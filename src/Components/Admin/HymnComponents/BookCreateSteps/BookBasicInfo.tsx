import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { HymnBookCreateModel } from "../../../../DataModels/HymnBookModel";
import { useNavigate } from "react-router-dom";
import BookHeader from "./BookHeader";

const BookBasicInfo: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useFormContext<HymnBookCreateModel>();

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Luganda",
    "Kiswahili",
    "Kinyarwanda",
    "Runyankole",
  ];

  const navigate = useNavigate();

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded ">
        <BookHeader />
        <div className="mb-3 d-flex flex-column flex-md-row justify-content-between">
          <label htmlFor="title" className="fs-5">
            <strong>Title</strong>
          </label>
          <div className="w-75">
            <input
              type="text"
              className=" form-control "
              {...register("title", {
                required: "title is required",
              })}
            />
            {errors.title && (
              <p className="text-danger text-sm">{errors.title.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3 d-flex flex-column flex-md-row justify-content-between">
          <label htmlFor="subTitle" className="fs-5">
            <strong>Subtitle</strong>
          </label>
          <div className="w-75">
            <input
              type="text"
              className="form-control "
              {...register("subTitle")}
            />
            {errors.subTitle && (
              <p className="text-danger text-sm">{errors.subTitle.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3 d-flex flex-column flex-md-row justify-content-between">
          <label htmlFor="hymnNumber" className="fs-5">
            <strong>Language</strong>
          </label>
          <div className="w-75">
            <select className="form-select" {...register("language")}>
              {languages.map((lang, index) => (
                <option key={index} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {errors.language && (
              <p className="text-danger text-sm">{errors.language.message}</p>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mb-5">
          <button
            className="w-75 btn btn-sm fs-5 btn-primary p-2"
            onClick={() => navigate("/songbooks/bookdetails")}
            /*  disabled={!isValid} */
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default BookBasicInfo;
