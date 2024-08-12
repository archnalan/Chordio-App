import axios from "axios";
import React, { useEffect, useState } from "react";
import Requests from "./Requests";
import { useNavigate } from "react-router-dom";
import {
  HymnBookModel,
  HymnBookSchema,
} from "../../../DataModels/HymnBookModel";
import DatePicker from "react-datepicker";

const BookCreate: React.FC = () => {
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Luganda",
    "Kiswahili",
    "Kinyarwanda",
    "Runyankole",
  ];

  const [hymnBook, setHymnBook] = useState<HymnBookModel>({
    id: 0,
    title: "",
    subTitle: "",
    description: "",
    publisher: "",
    publicationDate: `${new Date()}`,
    isbn: "",
    author: "",
    edition: "",
    language: languages[0],
    addedTime: `${new Date()}`,
  });

  /* const [yearOptions, setYearOptions] = useState([]); */
  const [selectYear, setSelectYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const exit = useNavigate();

  const handleYearChange = (date: Date) => {
    const yearString = date.getFullYear().toString();
    setSelectYear(yearString);
    setHymnBook({
      ...hymnBook,
      publicationDate: `${yearString}-01-01T00:00:00`,
    });
  };

  /* useEffect(() => {
    const generateYearOptions = () => {
      const options = [];

      let currentYear = new Date().getFullYear();
      for (let year = 0; year < currentYear; year++) {
        options.push(year);
      }

      console.log("🚀 ~ generateYearOptions ~ options:", options);
      setYearOptions(options);
    };
    generateYearOptions();
  }, []); */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* if (selectYear === 2023) {
      setHymnBook({
        ...hymnBook,
        publicationDate: `${selectYear}-01-01T00:00:00`,
      });
    } */
    sendHymnBookData();
  };

  const sendHymnBookData = async () => {
    console.log("🚀 ~ sendHymnBookData ~ hymnBook:", hymnBook);
    try {
      const response = await axios.post(Requests.createHymnBook, hymnBook);

      console.log("🚀 ~ sendHymnBookData ~ response:", response);
      exit("/admin/hymnbooks", {
        state: {
          successMessage: `HymnBook: ${hymnBook.title} created successfully!`,
        },
      });
    } catch (error) {
      console.error("Error Sending Data", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h1 className="mb-3">Create a Book</h1>
        {/* {errors &&
          errors.map((error, index) => (
            <p key={index} className="text-danger text-sm">
              {error}
            </p>
          ))}
        */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="title" className="fs-5">
                <strong>Title:</strong>
              </label>
              <input
                type="text"
                name="Title"
                className="w-75 form-control "
                onChange={(e) =>
                  setHymnBook({ ...hymnBook, title: e.target.value })
                }
              />
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="subTitle" className="fs-5">
                <strong>Subtitle:</strong>
              </label>
              <input
                type="text"
                name="subTitle"
                className="w-75 form-control "
                onChange={(e) =>
                  setHymnBook({ ...hymnBook, subTitle: e.target.value })
                }
              />
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="publisher" className="fs-5">
                <strong>Publisher:</strong>
              </label>
              <input
                type="text"
                name="Publisher"
                className="w-75 form-control "
                onChange={(e) =>
                  setHymnBook({ ...hymnBook, publisher: e.target.value })
                }
              />
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="isbn" className="fs-5">
                <strong>ISBN:</strong>
              </label>
              <input
                type="text"
                name="isbn"
                className="w-75 form-control "
                onChange={(e) =>
                  setHymnBook({ ...hymnBook, isbn: e.target.value })
                }
              />
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="edition" className="fs-5">
                <strong>Edition:</strong>
              </label>
              <input
                type="text"
                name="edition"
                className="w-75 form-control "
                onChange={(e) =>
                  setHymnBook({ ...hymnBook, edition: e.target.value })
                }
              />
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnNumber" className="fs-5">
                <strong>Language:</strong>
              </label>
              <select
                value={hymnBook.language}
                onChange={(e) => {
                  setHymnBook({ ...hymnBook, language: e.target.value });
                }}
                className="w-75 form-select"
              >
                {languages.map((lang, index) => (
                  <option key={index} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnAuthor" className="fs-5">
                <strong>Author:</strong>
              </label>
              <input
                type="text"
                name="hymnAuthor"
                className="w-75 form-control"
                onChange={(e) =>
                  setHymnBook({ ...hymnBook, author: e.target.value })
                }
              />
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnWrittenDate" className="fs-5">
                <strong>Publication Date:</strong>
              </label>

              <DatePicker
                value={new Date(selectYear)}
                onChange={handleYearChange}
                format="y"
                showYearPicker
                clearIcon={null}
                calendarIcon={null}
                className="w-75 form-select"
              />

              {/* <select
                value={selectYear}
                className="w-75 form-select"
                onChange={(e) => {
                  setSelectYear(e.target.value);
                  setHymnBook({
                    ...hymnBook,
                    publicationDate: `${e.target.value}-01-01T00:00:00`,
                  });
                }}
              >
                {yearOptions.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select> */}
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="description" className="fs-5">
                <strong>Description:</strong>
              </label>
              <textarea
                type="text"
                name="description"
                className="w-75 form-control overflow-scroll "
                onChange={(e) => {
                  e.preventDefault();
                  setHymnBook({ ...hymnBook, description: e.target.value });
                }}
              ></textarea>
            </div>
            <div className="d-flex justify-content-end mb-5">
              <button className="btn btn-sm btn-danger p-2 me-2">Cancel</button>
              <button type="submit" className="btn btn-sm btn-primary p-2">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookCreate;
