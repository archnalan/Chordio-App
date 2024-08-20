import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { HymnCreateModel } from "../../../../DataModels/HymnModel";
import SongHeader from "./SongHeader";
import YearRangePicker from "../../../Helper/YearRangePicker";

const SongAdditInfo: React.FC = () => {
  const {
    register,
    watch,
    control,
    formState: { errors, isValid },
  } = useFormContext<HymnCreateModel>();

  const navigate = useNavigate();
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded ">
        <SongHeader />
        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="hymnAuthor" className="fs-5">
            <strong>Author</strong>
          </label>
          <div className="w-75">
            <input
              type="text"
              className="form-control"
              {...register("writtenBy")}
            />
            {errors.writtenBy && (
              <p className="text-danger text-sm">{errors.writtenBy.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="songWrittenDate" className="fs-5">
            <strong>Written Dates</strong>
          </label>
          <div className="w-75 ">
            <Controller
              name="writtenDateRange"
              control={control}
              render={({ field }) => (
                <YearRangePicker
                  yearStart={
                    field.value ? parseInt(field.value.split("-")[0], 10) : null
                  }
                  yearEnd={
                    field.value ? parseInt(field.value.split("-")[1], 10) : null
                  }
                  onChange={(range) => {
                    if (range) {
                      field.onChange(`${range[0]}-${range[1]}`);
                    } else {
                      field.onChange(null);
                    }
                  }}
                />
              )}
            />
            {errors.writtenDateRange && (
              <p className="text-danger text-sm">
                {errors.writtenDateRange.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-100 mb-3 d-flex justify-content-between form-floating">
          <textarea
            className="form-control "
            style={{ height: 100 }}
            id="floatingTextarea2"
            placeholder="what inspired this song?"
            {...register("history")}
          ></textarea>
          <label htmlFor="floatingTextarea2" className="fs-6">
            History
          </label>
          {errors.history && (
            <p className="text-danger text-sm">{errors.history.message}</p>
          )}
        </div>
        <div className="d-flex justify-content-end mb-5">
          <button
            type="button"
            className="w-100 btn btn-sm fs-5 btn-primary p-2"
            disabled={!isValid}
            onClick={() => navigate("/songs/reviewdetails")}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default SongAdditInfo;
