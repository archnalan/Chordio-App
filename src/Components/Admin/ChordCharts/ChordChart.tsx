import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { SiAudiomack } from "react-icons/si";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { ChartModel, ChartSchema } from "../../../DataModels/ChartModel";
import Pagination from "../../Helper/Pagination";
import ChartRequest from "../../../API/ChartRequest";
import "./ChordChart.css";
import { IoSearchOutline } from "react-icons/io5";

const ChordChart: React.FC = () => {
  const [charts, setCharts] = useState<ChartModel[]>([]);
  const [filteredCharts, setfilteredCharts] = useState<ChartModel[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [chartsPerPage] = useState(4);
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
    const FetchData = async () => {
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
        setfilteredCharts(validateCharts.data);
      } catch (error) {
        console.error(error);
      }
    };
    FetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (charts) {
        const searchResult = charts.filter(
          (chart) =>
            String(chart.fretPosition).includes(normalizedQuery) ||
            chart.filePath.toLowerCase().includes(searchQuery) ||
            chart.positionDescription?.toLowerCase().includes(searchQuery) ||
            chart.chartAudioFilePath?.toLowerCase().includes(searchQuery)
        );
        setfilteredCharts(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredCharts(charts);
    }
  };

  const handleDelete = (id: number) => {
    const confirm = window.confirm("Would you like to delete chart?");
    if (confirm) {
      const DeleteData = async () => {
        try {
          const response = ChartRequest.deleteChordChart(id);
          console.log(response);

          window.location.reload();
        } catch (error) {
          console.error("Error deleting chart", error);
        }
      };
      DeleteData();
    }
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPageIndex(selectedPage);
  };

  const pageCount = Math.ceil(filteredCharts.length / chartsPerPage);
  const offset = currentPageIndex * chartsPerPage;
  const currentCharts = filteredCharts.slice(offset, offset + chartsPerPage);

  return (
    <>
      <div className="d-flex flex-column justify-content-start align-items-center bg-light m-3 ">
        <h1>List of Chord Charts</h1>
        {successMessage && (
          <div className="w-75 alert alert-success text-wrap" role="alert">
            {successMessage}
          </div>
        )}
        <div
          className="w-75 rounded  border-shadow p-3 "
          style={{ width: "100%" }}
        >
          <div className="d-flex justify-content-between mb-3">
            <div className="d-flex w-50 justify-content-start align-items-center position-relative me-5">
              <input
                type="text"
                className="form-control ps-5 rounded"
                placeholder="search a chord chart..."
                onChange={handleSearch}
              />
              <button className="btn btn-outline position-absolute ">
                <IoSearchOutline />
              </button>
            </div>
            <Link
              to="/admin/chordcharts/create"
              className="btn btn-success mb-4"
            >
              <RiStickyNoteAddFill />
            </Link>
          </div>
          <div className="container d-flex ">
            <div className="row row-cols-4">
              {currentCharts.map((chart, index) => (
                <div className="col mb-4" key={index}>
                  <div
                    className="card d-flex flex-column"
                    style={{ height: "100%" }}
                  >
                    <img
                      src={chart.filePath}
                      alt={chart.filePath}
                      className="w-100 card-img-top  img-thumbnail "
                    />
                    <div className="card-body">
                      <h5 className="card-title">Fret: {chart.fretPosition}</h5>
                      <p className="card-text">
                        {chart.positionDescription &&
                        chart.positionDescription.length > 25
                          ? `${chart.positionDescription.slice(0, 25)}...`
                          : chart.positionDescription}
                      </p>
                    </div>
                    <div className="card-footer d-flex justify-content-center bg-dark-subtle bg-gradient">
                      <Link
                        to={`${chart.id}`}
                        className="btn btn-sm btn-outline-success me-2"
                      >
                        <FiList />
                      </Link>
                      <Link
                        to={`edit/${chart.id}`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(chart.id)}
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

export default ChordChart;
