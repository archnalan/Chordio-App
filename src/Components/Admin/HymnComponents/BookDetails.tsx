import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { idSchema } from "../../../DataModels/ValidateID";
import {
  HymnBookModel,
  HymnBookSchema,
} from "../../../DataModels/HymnBookModel";
import BookRequest from "../../../API/BookRequest";
import { format } from "date-fns";

const BookDetails: React.FC = () => {
  const [book, setBook] = useState<HymnBookModel>({
    id: 0,
    isbn: "",
    title: "",
    publisher: "",
    publicationDate: "",
    description: "",
    language: "",
    addedTime: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const getSong = async () => {
      const validatedId = idSchema.parse(id);

      const response = await BookRequest.fetchSpecificSongBook(validatedId);

      const songResult = HymnBookSchema.safeParse(response.data);
      if (!songResult.success) {
        console.error(
          "🚀 ~ getSong ~ songResult.error:",
          songResult.error.issues
        );
        return;
      }

      setBook(songResult.data);
    };
    getSong();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date"; // Handle invalid date
    }
    return format(date, "dd MMMM yyyy");
  };

  return (
    <div className="vh-100 d-flex flex-column justify-content-start align-items-center bg-light m-3 ">
      <div className="w-50 border bg-white px-5 pt-3 pb-3 rounded">
        <h1 className="mb-5">Collection Details</h1>
        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Title</strong>
          <span>{book.title}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Edition</strong>
          <span>{book.edition}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>ISBN</strong>
          <span>{book.isbn}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Language</strong>
          <span>{book.language}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Publisher</strong>
          <span>{book.publisher}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Publishing Date</strong>
          <span>{formatDate(book.publicationDate)}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Author</strong>
          <span>{book.author}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Description</strong>
          <span>{book.description}</span>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <Link to={"/admin/songbooks"} className="btn btn-danger me-2">
            Back
          </Link>
          <Link to={`/admin/songbooks/edit/${id}`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
