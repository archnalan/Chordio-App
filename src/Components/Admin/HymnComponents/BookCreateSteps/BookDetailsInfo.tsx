import React from "react";
import { useFormContext } from "react-hook-form";
import { HymnBookCreateModel } from "../../../../DataModels/HymnBookModel";
import BookHeader from "./BookHeader";
import { useNavigate } from "react-router-dom";

const BookDetailsInfo: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useFormContext<HymnBookCreateModel>();
  const navigate = useNavigate();
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded ">
        <BookHeader />

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="edition" className="fs-5">
            <strong>Edition</strong>
          </label>
          <div className="w-75 ">
            <input
              type="text"
              className="form-control "
              {...register("edition")}
            />
            {errors.edition && (
              <p className="text-danger text-sm">{errors.edition.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="isbn" className="fs-5">
            <strong>ISBN</strong>
          </label>
          <div className="w-75 ">
            <input
              type="text"
              className="form-control "
              {...register("isbn")}
            />
            {errors.isbn && (
              <p className="text-danger text-sm">{errors.isbn.message}</p>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mb-5">
          <button
            type="button"
            className="w-75 btn btn-sm fs-5 btn-primary p-2"
            onClick={() => navigate("/songbooks/publicationinfo")}
            /* disabled={!isValid} */
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default BookDetailsInfo;
