import axios from "axios";
import React, { useEffect, useState } from "react";

import { IoSearchOutline } from "react-icons/io5";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HymnBookModel, HymnBookSchema } from "../../DataModels/HymnBookModel";
import Pagination from "../Helper/Pagination";
import { idSchema } from "../../DataModels/ValidateID";
import BookRequest from "../../API/BookRequest";

const SongBook: React.FC = () => {
  const [songBooks, setSongBooks] = useState<HymnBookModel[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [bookSearch, setBookSearch] = useState<HymnBookModel[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [songsPerPage] = useState(6);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getSongBooks = async () => {
      try {
        const response = await BookRequest.fetchAllSongBooks();

        const validatedBooks = HymnBookSchema.array().safeParse(
          response.data.$values
        );

        if (!validatedBooks.success) {
          console.error(
            "🚀 ~ getSongBooks ~ validatedBooks:",
            validatedBooks.error.issues
          );
          return;
        }

        setSongBooks(validatedBooks.data);
        setBookSearch(validatedBooks.data);
      } catch (error) {
        console.error("Error fetching Books: ", error);
      }
    };
    getSongBooks();
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      console.log(
        "🚀 ~ useEffect ~ location.state?.successMessage:",
        location.state?.successMessage
      );
      setSuccessMessage(location.state?.successMessage);
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      //clear the success state object
      navigate(location.pathname, { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (book: string, id: number) => {
    const confirm = window.confirm(
      `Would you like to delete Song book ${book}`
    );
    if (confirm) {
      deleteSongBook(id);
    }
  };
  const deleteSongBook = async (id: number) => {
    try {
      const validatedId = idSchema.parse(id);
      const response = await BookRequest.deleteSongBook(validatedId);
      console.log("🚀 ~ deleteSongBook ~ response:", response);

      window.location.reload();
    } catch (error) {
      console.log("🚀 ~ deleteSongBook ~ error:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.toLowerCase();

    if (searchQuery !== "") {
      const results = songBooks.filter(
        (bk) =>
          bk.title.toLowerCase().includes(searchQuery) ||
          bk.publisher.toLowerCase().includes(searchQuery) ||
          bk.author?.toLowerCase().includes(searchQuery)
      );
      console.log("🚀 ~ handleSearch ~ results:", results);
      setBookSearch(results);
    } else {
      setBookSearch(songBooks);
    }
  };

  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(bookSearch.length / songsPerPage);
  const offset = currentPageIndex * songsPerPage;
  const currentBooks = bookSearch.slice(offset, offset + songsPerPage);

  return (
    <div className="d-flex flex-column justify-content-start align-items-center bg-light m-3 vh-100">
      <h1>Music Collection</h1>
      {successMessage && (
        <div className="w-75 alert alert-success text-wrap" role="alert">
          {successMessage}
        </div>
      )}
      <div className="w-75 rounded bg-white border-shadow p-3 ">
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex w-50 justify-content-start align-items-center position-relative me-5">
            <input
              type="text"
              className="form-control ps-5 rounded"
              placeholder="Find a collection..."
              onChange={handleSearch}
            />
            <button className="btn btn-outline position-absolute ">
              <IoSearchOutline />
            </button>
          </div>
          <Link to="/admin/songbooks/create" className="btn btn-success">
            <RiStickyNoteAddFill />
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-align-middle">
            <thead>
              <tr>
                <td className="col-number">Title</td>
                <td className="col-title">Publisher</td>
                <td className="col-author">Author</td>
                <td className="col-actions">Actions</td>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.publisher}</td>
                  <td>{book.author}</td>
                  <td>
                    <Link
                      to={`${book.id}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      <FiList />
                    </Link>
                    <Link
                      to={`edit/${book.id}`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      <FiEdit />
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(book.title, book.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="Page navigation">
          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default SongBook;
