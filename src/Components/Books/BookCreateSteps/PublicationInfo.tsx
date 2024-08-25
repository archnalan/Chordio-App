import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { HymnBookCreateModel } from "../../../DataModels/HymnBookModel";
import BookHeader from "./BookHeader";
import { DatePicker } from "antd";
import { useNavigate } from "react-router-dom";

const PublicationInfo: React.FC = () => {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors, isValid },
  } = useFormContext<HymnBookCreateModel>();

  const navigate = useNavigate();

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded ">
        <BookHeader />

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="publisher" className="fs-5">
            <strong>Publisher</strong>
          </label>
          <div className="w-75 ">
            <input
              type="text"
              className="form-control "
              {...register("publisher")}
            />
            {errors.publisher && (
              <p className="text-danger text-sm">{errors.publisher.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="hymnWrittenDate" className="fs-5">
            <strong>Publication Date:</strong>
          </label>
          <div className="w-100">
            <Controller
              name="publicationDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  picker="month"
                  format="MMMM YYYY"
                  onChange={(date) => {
                    const yearString = date?.year().toString();
                    const monthString = (date?.month() + 1)
                      .toString()
                      .padStart(2, "0");
                    field.onChange(`${yearString}-${monthString}-01T00:00:00`);
                  }}
                  className="w-100 fs-5 form-select "
                />
              )}
            />
            {errors.publicationDate && (
              <p className="text-danger text-sm">
                {errors.publicationDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mb-5">
          <button
            type="button"
            className="w-75 btn btn-sm fs-5 btn-primary p-2"
            /* disabled={!isValid} */
            onClick={() => navigate("/songbooks/additionalinfo")}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default PublicationInfo;
