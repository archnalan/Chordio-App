import React from "react";
import { FiEdit, FiList, FiTrash2 } from "react-icons/fi";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { Link } from "react-router-dom";
import { ChartModel } from "../../../DataModels/ChartModel";
import { ChordModel } from "../../../DataModels/ChordModel";
import ChordRequest from "../../../API/ChordRequest";
import "./ChordCard.css";

type ChordCardType = {
  charts: ChartModel[];
  currentChords: ChordModel[];
};
const ChordCard: React.FC<ChordCardType> = ({ charts, currentChords }) => {
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

  return (
    <div className="container d-flex chord-card">
      <div className="row row-cols-4 ">
        {currentChords.map((chord, index) => {
          const filteredCharts = charts.filter(
            (chart) => chart.chordId === chord.id
          );
          return (
            <div className="col mb-4 d-flex flex-column" key={index}>
              <div className="card ">
                <div id={`carouselCharts-${index}`} className="carousel slide">
                  <div className="carousel-inner">
                    {charts
                      .filter((chart) => chart.chordId === chord.id)
                      .map((chart, chartIndex) => (
                        <div
                          key={chart.id}
                          className={`carousel-item ${
                            chartIndex === 0 ? "active" : ""
                          }`}
                        >
                          <img
                            src={chart.filePath}
                            alt={chord.chordName}
                            className="d-block w-100 card-img-top  img-thumbnail mb-2"
                          />
                          <h6 className="d-block text-center text-secondary ">
                            Fret {chart.fretPosition}
                          </h6>
                        </div>
                      ))}
                  </div>
                  {filteredCharts.length > 0 && (
                    <div>
                      <button
                        className="carousel-control-prev text-dark"
                        type="button"
                        data-bs-target={`#carouselCharts-${index}`}
                        data-bs-slide="prev"
                      >
                        <MdOutlineNavigateBefore size={24} />
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next text-dark"
                        type="button"
                        data-bs-target={`#carouselCharts-${index}`}
                        data-bs-slide="next"
                      >
                        <MdOutlineNavigateNext size={24} />
                        <span className="visually-hidden">Next</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#carouselCharts-${index}`}
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="card-body">
                  <h5 className="card-title">Chord {chord.chordName}</h5>
                </div>
                <div className="card-footer d-flex justify-content-center">
                  <Link to={`${chord.id}`} className="btn btn-sm btn-info me-2">
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
          );
        })}
      </div>
    </div>
  );
};

export default ChordCard;
