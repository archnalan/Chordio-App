import React from "react";
import { useFormContext } from "react-hook-form";
import { HymnBookCreateModel } from "../../../../DataModels/HymnBookModel";
import BookHeader from "./BookHeader";
import { DatePicker } from "antd";
import { useNavigate } from "react-router-dom";

const AdditInfo: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useFormContext<HymnBookCreateModel>();

  const navigate = useNavigate();
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded ">
        <BookHeader />

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="hymnAuthor" className="fs-5">
            <strong>Author</strong>
          </label>
          <div className="w-75">
            <input
              type="text"
              className="form-control"
              {...register("author")}
            />
            {errors.author && (
              <p className="text-danger text-sm">{errors.author.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="description" className="fs-5">
            <strong>Description</strong>
          </label>
          <div className="w-75 ">
            <textarea
              className="form-control overflow-scroll "
              {...register("description")}
            ></textarea>
            {errors.description && (
              <p className="text-danger text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-end mb-5">
          <button
            type="button"
            className="w-75 btn btn-sm fs-5 btn-primary p-2"
            /* disabled={!isValid} */
            onClick={() => navigate("/songbooks/reviewdetails")}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default AdditInfo;
