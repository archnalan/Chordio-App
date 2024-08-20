import React from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { HymnCreateModel } from "../../../../DataModels/HymnModel";
import SongHeader from "./SongHeader";
import SongCreated from "./SongCreated";

type popupModal = {
  isSongCreated: boolean;
  setIsSongCreated: React.Dispatch<React.SetStateAction<boolean>>;
};

const SongInfoReview: React.FC<popupModal> = ({
  isSongCreated,
  setIsSongCreated,
}) => {
  const {
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<HymnCreateModel>();
  const formData = watch();

  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex w-100 vh-100 justify-content-center align-items-start z-0 bg-light">
        <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded mt-5">
          <SongHeader />
          <div className="mb-3 d-flex justify-content-between">
            <label htmlFor="title" className="fs-5">
              <strong>Number</strong>
            </label>
            <div className="w-75 border ms-10 text-end pe-3">
              {formData.number}
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <label htmlFor="subTitle" className="fs-5">
              <strong>Title</strong>
            </label>
            <div className="w-75 border ms-10 text-end pe-3">
              {formData.title}
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <label htmlFor="publisher" className="fs-5">
              <strong>Category</strong>
            </label>
            <div className="w-75 border ms-10 text-end pe-3">
              {formData.categoryId}
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <label htmlFor="edition" className="fs-5">
              <strong>Author</strong>
            </label>
            <div className="w-75 border ms-10 text-end pe-3">
              {formData.writtenBy}
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <label htmlFor="isbn" className="fs-5">
              <strong>Written Date Range</strong>
            </label>
            <div className="w-75 border ms-10 text-end pe-3">
              {formData.writtenDateRange}
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-between">
            <label htmlFor="hymnNumber" className="fs-5">
              <strong>History</strong>
            </label>
            <div className="w-75 border ms-10 text-end pe-3">
              {formData.history}
            </div>
          </div>
          {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
          <div className="d-flex flex-column justify-content-end mb-5">
            <div className="d-flex justify-content-end">
              <button
                className="btn fs-5 btn-sm btn-secondary p-2 ps-4 pe-4 me-2"
                onClick={() => navigate("/songs/additinfo")}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                className="btn fs-5 btn-sm btn-danger p-2 me-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm fs-5 btn-primary p-2 ps-4 pe-4"
                disabled={isSubmitting}
              >
                Confirm
              </button>
            </div>
            <div className="mb-2">
              {errors.root && (
                <p className="text-danger text-sm">{errors.root.message}</p>
              )}
            </div>
          </div>
        </div>
        {isSongCreated && <SongCreated setIsSongCreated={setIsSongCreated} />}
      </div>
    </>
  );
};

export default SongInfoReview;
