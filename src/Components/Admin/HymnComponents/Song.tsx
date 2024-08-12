import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Requests from "./Requests";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import {
  HymnWithCategory,
  HymnWithCategorySchema,
} from "../../../DataModels/HymnModel";
import SongRequest from "../../../API/SongRequest";
import { MessageSchema } from "../../../DataModels/MessageSchema";
import Pagination from "../../Helper/Pagination";

const Song: React.FC = () => {
  const [songs, setSongs] = useState<HymnWithCategory[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [songsPerPage] = useState(8);
  const location = useLocation();
  const navigate = useNavigate();

  const [filteredSongs, setfilteredSongs] = useState<HymnWithCategory[]>([]);

  useEffect(() => {
    const getSongs = async () => {
      const response = await SongRequest.fetchAllSongs();

      const validatedSong = HymnWithCategorySchema.array().safeParse(
        response.data.$values
      );
      if (!validatedSong.success) {
        console.error(
          "🚀 ~ getSongs ~ validatedSong.error:",
          validatedSong.error
        );
        return;
      }
      setSongs(validatedSong.data);
      setfilteredSongs(validatedSong.data);
    };
    getSongs();
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      const successMessage = MessageSchema.parse(location.state.successMessage);
      console.log(
        "🚀 ~ useEffect ~ location.state?.successMessage:",
        successMessage
      );
      setSuccessMessage(successMessage);
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      //clear the success state object
      navigate(location.pathname, { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (name: string, id: number) => {
    const confirm = window.confirm(`Do you wish to delete Song: ${name}`);
    if (confirm) {
      const deleteSong = async () => {
        try {
          const response = await axios.delete(`${Requests.deleteHymn}${id}`);

          console.log("🚀 ~ deleteSong ~ response:", response);

          window.location.reload();
        } catch (error) {
          console.error("Error deleting Song", error);
        }
      };
      deleteSong();
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (songs) {
        const searchResult = songs.filter(
          (song) =>
            String(song.number).includes(searchQuery) ||
            String(song.number).includes(normalizedQuery) ||
            song.title.toLowerCase().includes(searchQuery) ||
            song.categoryName.toLowerCase().includes(searchQuery) ||
            song.writtenBy?.toLowerCase().includes(searchQuery)
        );
        setfilteredSongs(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredSongs(songs);
    }
  };
  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(filteredSongs.length / songsPerPage);
  const offset = currentPageIndex * songsPerPage;
  const currentSongs = filteredSongs.slice(offset, offset + songsPerPage);

  return (
    <div className="d-flex flex-column justify-content-start align-items-center bg-light m-3 vh-100">
      <h1>List of Songs</h1>
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
              placeholder="search a Song..."
              onChange={handleSearch}
            />
            <button className="btn btn-outline position-absolute ">
              <IoSearchOutline />
            </button>
          </div>
          <Link to="/admin/songs/create" className="btn btn-success">
            <RiStickyNoteAddFill />
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-align-middle">
            <thead>
              <tr>
                <td className="col-number">Number</td>
                <td className="col-title">Title</td>
                <td className="col-category">Category</td>
                <td className="col-author">Author</td>
                <td className="col-actions">Actions</td>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentSongs.map((song) => (
                <tr key={song.id}>
                  <td>{String(song.number).padStart(3, "0")}</td>
                  <td>{song.title}</td>
                  <td>{song.categoryName}</td>
                  <td>{song.writtenBy}</td>
                  <td>
                    <Link
                      to={`${song.id}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      <FiList />
                    </Link>
                    <Link
                      to={`edit/${song.id}`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(song.title, song.id)}
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

export default Song;
