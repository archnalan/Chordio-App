import React from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import BookHeader from "./BookHeader";
import { HymnBookCreateModel } from "../../../../DataModels/HymnBookModel";
import { useNavigate } from "react-router-dom";

type reviewProps = {
  onSubmit: () => void;
};
const BookInfoReview: React.FC<reviewProps> = ({ onSubmit }) => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext<HymnBookCreateModel>();
  const formData = watch();

  const navigate = useNavigate();
  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <BookHeader />
        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="title" className="fs-5">
            <strong>Title</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.title}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="subTitle" className="fs-5">
            <strong>Subtitle</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.subTitle}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="publisher" className="fs-5">
            <strong>Publisher:</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.publisher}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="isbn" className="fs-5">
            <strong>ISBN:</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.isbn}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="edition" className="fs-5">
            <strong>Edition:</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.edition}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="hymnNumber" className="fs-5">
            <strong>Language:</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.language}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="hymnAuthor" className="fs-5">
            <strong>Author:</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.author}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="hymnWrittenDate" className="fs-5">
            <strong>Publication Date:</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.publicationDate}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="description" className="fs-5">
            <strong>Description:</strong>
          </label>
          <div className="w-75 border ms-10 text-end btn pe-3">
            {formData.description}
          </div>
        </div>
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        <div className="d-flex justify-content-end mb-5">
          <button
            className="btn fs-5 btn-sm btn-secondary p-2 ps-4 pe-4 me-2"
            onClick={() => navigate("/songbooks/additionalinfo")}
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
            onClick={onSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookInfoReview;
