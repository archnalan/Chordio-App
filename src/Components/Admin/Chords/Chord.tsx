import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { RiStickyNoteAddFill } from "react-icons/ri";
import Pagination from "../../Helper/Pagination";
import { IoSearchOutline } from "react-icons/io5";
import ChordRequest from "../../../API/ChordRequest";
import { ChordModel, ChordSchema } from "../../../DataModels/ChordModel";
import { ChartModel, ChartSchema } from "../../../DataModels/ChartModel";
import ChartRequest from "../../../API/ChartRequest";
import ChordCreate from "./ChordCreate";
import ChordCard from "./ChordCard";

const Chord: React.FC = () => {
  const [chords, setChords] = useState<ChordModel[]>([]);
  const [charts, setCharts] = useState<ChartModel[]>([]);
  const [filteredChords, setfilteredChords] = useState<ChordModel[]>([]);
  const [openChordCreate, setOpenChordCreate] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [chordsPerPage] = useState(4);
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

        const validateChords = ChordSchema.array().safeParse(
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

  useEffect(() => {
    const FetchCharts = async () => {
      try {
        const response = await ChartRequest.fetchAllChordCharts();

        const validateCharts = ChartSchema.array().safeParse(
          response.data.$values
        );
        if (!validateCharts.success) {
          console.error(
            "🚀 ~ FetchData ~ validateCharts.success:",
            validateCharts.error.issues
          );
          return;
        }
        setCharts(validateCharts.data);
      } catch (error) {
        console.error(error);
      }
    };
    FetchCharts();
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

  const handlePageChange = (selectedPage: number) => {
    setCurrentPageIndex(selectedPage);
  };

  const pageCount = Math.ceil(filteredChords.length / chordsPerPage);
  const offset = currentPageIndex * chordsPerPage;
  const currentChords = filteredChords.slice(offset, offset + chordsPerPage);

  return (
    <>
      <div className="w-100 vh-100 overflow-y-scroll bg-light ">
        <div className="d-flex flex-column justify-content-start align-items-center bg-light vh-100">
          <h1>List of Chords</h1>
          {/* {successMessage && (
          <div className="w-75 alert alert-success text-wrap" role="alert">
            {successMessage}
          </div>
        )} */}
          <div className="w-75 border-shadow p-3 ">
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex w-25 justify-content-start align-items-center position-relative me-5">
                <input
                  type="text"
                  className="form-control ps-5 rounded"
                  style={{ height: "3rem" }}
                  placeholder="search a chord..."
                  onChange={handleSearch}
                />
                <button className="btn btn-outline position-absolute ">
                  <IoSearchOutline />
                </button>
              </div>
              <div className="d-flex align-items-center border rounded ps-2 pe-2 cursor-pointer">
                <label htmlFor="#createlink" className="me-2">
                  Add Chord
                </label>
                <button
                  id="createlink"
                  className="btn btn-success "
                  onClick={() => setOpenChordCreate(true)}
                >
                  <RiStickyNoteAddFill />
                </button>
              </div>
            </div>

            <ChordCard charts={charts} currentChords={currentChords} />

            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
          {openChordCreate && (
            <ChordCreate setOpenChordCreate={setOpenChordCreate} />
          )}
        </div>
      </div>
    </>
  );
};

export default Chord;
