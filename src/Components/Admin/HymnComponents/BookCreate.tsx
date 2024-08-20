import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HymnBookModel,
  HymnBookSchema,
} from "../../../DataModels/HymnBookModel";
import { DatePicker, message } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const BookCreate: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HymnBookModel>({
    resolver: zodResolver(HymnBookSchema),
    mode: "all",
  });
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

  console.log("🚀 ~ hymnBook:", hymnBook);
  /* const [yearOptions, setYearOptions] = useState([]); */
  const [selectYear, setSelectYear] = useState<string>(
    new Date().getFullYear().toString()
  );

  const exit = useNavigate();

  const handleYearChange = (date: moment.Moment | null) => {
    if (date) {
      const yearString = date.year().toString();
      const monthString = (date.month() + 1).toString().padStart(2, "0"); // month() is zero-indexed
      setSelectYear(yearString);
      setHymnBook({
        ...hymnBook,
        publicationDate: `${yearString}-${monthString}-01T00:00:00`,
      });
    }
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
      /*const response = await axios.post(Requests.createHymnBook, hymnBook);

      console.log("🚀 ~ sendHymnBookData ~ response:", response);
      exit("/admin/hymnbooks", {
        state: {
          successMessage: `HymnBook: ${hymnBook.title} created successfully!`,
        },
      }); */
    } catch (error) {
      console.error("Error Sending Data", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h1 className="mb-3">Create a Collection</h1>
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
              <div className="w-75">
                <input
                  type="text"
                  className=" form-control "
                  {...register("title")}
                  /* onChange={(e) =>
                  setHymnBook({ ...hymnBook, title: e.target.value })
                } */
                />
                {errors.title && (
                  <p className="text-danger text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="subTitle" className="fs-5">
                <strong>Subtitle:</strong>
              </label>
              <div className="w-75 ">
                <input
                  type="text"
                  className="form-control "
                  {...register("subTitle")}
                  /* onChange={(e) =>
                  setHymnBook({ ...hymnBook, subTitle: e.target.value })
                } */
                />
                {errors.subTitle && (
                  <p className="text-danger text-sm">
                    {errors.subTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="publisher" className="fs-5">
                <strong>Publisher:</strong>
              </label>
              <div className="w-75 ">
                <input
                  type="text"
                  className="form-control "
                  {...register("publisher")}
                  /* onChange={(e) =>
                  setHymnBook({ ...hymnBook, publisher: e.target.value })
                } */
                />
                {errors.publisher && (
                  <p className="text-danger text-sm">
                    {errors.publisher.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="isbn" className="fs-5">
                <strong>ISBN:</strong>
              </label>
              <div className="w-75 ">
                <input
                  type="text"
                  className="form-control "
                  {...register("isbn")}
                  /* onChange={(e) =>
                  setHymnBook({ ...hymnBook, isbn: e.target.value })
                } */
                />
                {errors.isbn && (
                  <p className="text-danger text-sm">{errors.isbn.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="edition" className="fs-5">
                <strong>Edition:</strong>
              </label>
              <div className="w-75 ">
                <input
                  type="text"
                  name="edition"
                  className="form-control "
                  onChange={(e) =>
                    setHymnBook({ ...hymnBook, edition: e.target.value })
                  }
                />
                {errors.edition && (
                  <p className="text-danger text-sm">
                    {errors.edition.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnNumber" className="fs-5">
                <strong>Language:</strong>
              </label>
              <div className="w-75">
                <select
                  value={hymnBook.language}
                  onChange={(e) => {
                    setHymnBook({ ...hymnBook, language: e.target.value });
                  }}
                  className="form-select"
                >
                  {languages.map((lang, index) => (
                    <option key={index} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                {errors.language && (
                  <p className="text-danger text-sm">
                    {errors.language.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnAuthor" className="fs-5">
                <strong>Author:</strong>
              </label>
              <div className="w-75">
                <input
                  type="text"
                  className="form-control"
                  {...register("author")}
                  /* onChange={(e) =>
                    setHymnBook({ ...hymnBook, author: e.target.value })
                  } */
                />
                {errors.author && (
                  <p className="text-danger text-sm">{errors.author.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnWrittenDate" className="fs-5">
                <strong>Publication Date:</strong>
              </label>
              <div className="w-75">
                <DatePicker
                  picker="month"
                  format="MMMM YYYY"
                  {...register("publicationDate")}
                  onChange={handleYearChange}
                  className="form-select"
                  disabled={handleSubmit}
                />
                {errors.publicationDate && (
                  <p className="text-danger text-sm">
                    {errors.publicationDate.message}
                  </p>
                )}
              </div>

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
              <div className="w-75 ">
                <textarea
                  className="form-control overflow-scroll "
                  {...register("description")}
                  /* onChange={(e) => {
                  e.preventDefault();
                  setHymnBook({ ...hymnBook, description: e.target.value });
                }} */
                ></textarea>
                {errors.description && (
                  <p className="text-danger text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <pre>{JSON.stringify(watch(), null, 2)}</pre>
            <div className="d-flex justify-content-end mb-5">
              <button
                className="btn btn-sm btn-danger p-2 me-2"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary p-2"
                disabled={isSubmitting}
              >
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
