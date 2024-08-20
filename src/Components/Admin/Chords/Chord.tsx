import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { SiAudiomack } from "react-icons/si";
import { RiStickyNoteAddFill } from "react-icons/ri";
import Pagination from "../../Helper/Pagination";
import { IoSearchOutline } from "react-icons/io5";

import ChordRequest from "../../../API/ChordRequest";
import {
  ChordWithChartsModel,
  ChordWithChartsSchema,
  ChordsModel,
  ChordsSchema,
} from "../../../DataModels/ChordModel";

const Chord: React.FC = () => {
  const [chords, setChords] = useState<ChordsModel[]>([]);
  const [filteredChords, setfilteredChords] = useState<ChordsModel[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [chordsPerPage] = useState(8);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    const FetchChords = async () => {
      try {
        const response = await ChordRequest.fetchChordsWithCharts();

        const validateChords = ChordWithChartsSchema.array().safeParse(
          response.data.$values
        );
        if (!validateChords.success) {
          console.error(
            "🚀 ~ FetchData ~ validateChords.error:",
            validateChords.error.issues
          );
          return;
        }
        setChords(validateChords.data);
        setfilteredChords(validateChords.data);
      } catch (error) {
        console.error(error);
      }
    };
    FetchChords();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (chords) {
        const searchResult = chords.filter(
          (chord) =>
            String(chord.id).includes(normalizedQuery) ||
            String(chord.difficulty).includes(normalizedQuery) ||
            chord.chordName.toLowerCase().includes(searchQuery) ||
            chord.chartAudioFilePath?.toLowerCase().includes(searchQuery)
        );
        setfilteredChords(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredChords(chords);
    }
  };

  const handleDelete = (id: number) => {
    const confirm = window.confirm("Would you like to delete chord?");
    if (confirm) {
      const DeleteData = async () => {
        try {
          const response = ChordRequest.deleteChord(id);
          console.log(response);

          window.location.reload();
        } catch (error) {
          console.error("Error deleting chord", error);
        }
      };
      DeleteData();
    }
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPageIndex(selectedPage);
  };

  const pageCount = Math.ceil(filteredChords.length / chordsPerPage);
  const offset = currentPageIndex * chordsPerPage;
  const currentChords = filteredChords.slice(offset, offset + chordsPerPage);

  return (
    <>
      <div className="d-flex flex-column justify-content-start align-items-center bg-light m-3 vh-100">
        <h1>List of Chords</h1>
        {successMessage && (
          <div className="w-75 alert alert-success text-wrap" role="alert">
            {successMessage}
          </div>
        )}
        <div className="w-75 border-shadow p-3">
          <div className="d-flex justify-content-between mb-3">
            <div className="d-flex w-50 justify-content-start align-items-center position-relative me-5">
              <input
                type="text"
                className="form-control ps-5 rounded"
                placeholder="search a chord..."
                onChange={handleSearch}
              />
              <button className="btn btn-outline position-absolute ">
                <IoSearchOutline />
              </button>
            </div>
            <Link
              to="/admin/chords/create"
              className="btn btn-success mb-4"
              /* data-bs-container="body"
              data-bs-toggle="popover"
              data-bs-placement="left"
              data-bs-trigger="hover-focus"
              data-bs-content="Add Chord." */
            >
              <RiStickyNoteAddFill />
            </Link>
          </div>
          <div className="container d-flex ">
            <div className="row row-cols-4 ">
              {currentChords.map((chord, index) => (
                <div className="col mb-4" key={index}>
                  <div className="card ">
                    <img
                      src={chord.charts}
                      alt={chord.chordName}
                      className="w-100 card-img-top  img-thumbnail mt-2"
                    />
                    <div className="card-body">
                      <h5 className="card-title">Chord {chord.chordName}</h5>
                    </div>
                    <div className="card-footer d-flex justify-content-center">
                      <Link
                        to={`${chord.id}`}
                        className="btn btn-sm btn-info me-2"
                      >
                        <FiList />
                      </Link>
                      <Link
                        to={`edit/${chord.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(chord.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
      </div>
    </>
  );
};

export default Chord;
