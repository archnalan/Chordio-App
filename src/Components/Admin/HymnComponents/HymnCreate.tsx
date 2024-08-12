import axios from "axios";
import React, { useEffect, useState } from "react";
import Requests from "./Requests";
import { useNavigate } from "react-router-dom";
import {
  HymnWithCategory,
  HymnWithCategorySchema,
} from "../../../DataModels/HymnModel";
import {
  CategoryModel,
  CategorySchema,
} from "../../../DataModels/CategoryModel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const HymnCreate: React.FC = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<HymnWithCategory>({
    resolver: zodResolver(HymnWithCategorySchema),
  });

  const [yearStart, setYearStart] = useState<number>(1100);
  const [yearEnd, setYearEnd] = useState<number>(1102);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const navigate = useNavigate();

  const handleYearStart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(e.target.value);

    setYearStart(selectedYear);
    if (selectedYear > yearEnd) {
      setYearEnd(yearStart);
    }
  };

  const handleYearEnd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(e.target.value);

    if (selectedYear >= yearStart) {
      setYearEnd(selectedYear);
    }
  };

  useEffect(() => {
    const generateYearOptions = () => {
      const options = [];
      for (let year = yearStart; year <= new Date().getFullYear(); year++) {
        options.push(year);
      }
      setYearOptions(options);
    };
    generateYearOptions();
  }, [yearStart, yearEnd]);

  useEffect(() => {
    const getCategory = async () => {
      const response = await axios.get(`${Requests.fetchAllCategories}`);
      const categories = response.data.$values;

      const validatedCategories = CategorySchema.array().safeParse(categories);

      if (!validatedCategories.success) {
        console.error(
          "🚀 ~ getCategory ~ validatedCategory.success:",
          validatedCategories.error
        );
        return;
      }
      setCategories(validatedCategories.data);
    };
    getCategory();
  }, []);

  const onSubmit = async (data: HymnWithCategory) => {
    try {
      console.log("🚀 ~ sendHymnData ~ hymn:", data);

      /*  const response = await axios.post(Requests.createHymn, data); */

      reset();
      navigate("/admin/hymns", {
        state: {
          successMessage: `Hymn: ${data.title} created successfully.`,
        },
      });
    } catch (error) {
      console.error("🚀 ~ sendHymnData ~ errorMessages:", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h1 className="mb-4">Create a Hymn</h1>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="d-flex flex-column"
          >
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnNumber" className="fs-5">
                <strong>Number:</strong>
              </label>
              <div className="w-75 flex-column">
                <input
                  {...register(
                    "number" /* {
                    setValueAs: (value: string) => parseInt(value, 10), // Convert string to number
                  } */
                  )}
                  type="number"
                  className="w-100 form-control btn btn-outline-secondary"
                  min="1"
                  step="1"
                />
                {errors.number && (
                  <p className="text-danger text-sm">{errors.number.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnTitle" className="fs-5">
                <strong>Title:</strong>
              </label>
              <div className="w-75 flex-column">
                <input
                  {...register("title")}
                  type="text"
                  name="hymnTitle"
                  className="w-100 form-control "
                />
                {errors.number && (
                  <p className="text-danger text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnTitle" className="fs-5">
                <strong>Category:</strong>
              </label>
              <div className="w-75 flex-column">
                <select
                  {...(register("categoryId"),
                  { setValueAs: (v: string) => (v === "" ? null : Number(v)) })}
                  name="category"
                  id="category-select"
                  className="w-100 form-select"
                >
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.number && (
                  <p className="text-danger text-sm">
                    {errors.categoryId?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnAuthor" className="fs-5">
                <strong>Author:</strong>
              </label>
              <div className="w-75 flex-column">
                <input
                  {...register("writtenBy")}
                  type="text"
                  name="hymnAuthor"
                  className="w-100 form-control"
                />
                {errors.number && (
                  <p className="text-danger text-sm">
                    {errors.writtenBy?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnWrittenDate" className="fs-5">
                <strong>Written Date:</strong>
              </label>
              <div className="d-flex align-items-center">
                <h5 className="me-2">From</h5>
                <select
                  value={yearStart}
                  onChange={handleYearStart}
                  className="form-select"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <h5 className="me-2 ms-2">to</h5>
                <select
                  value={yearEnd}
                  onChange={handleYearEnd}
                  className="form-select"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year} hidden={year < yearStart}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnHistory" className="fs-5">
                <strong>History:</strong>
              </label>
              <div className="w-75 flex-column">
                <textarea
                  {...register("history")}
                  name="hymnHistory"
                  className="w-100 form-control overflow-scroll "
                ></textarea>
                {errors.history && (
                  <p className="text-danger text-sm">
                    {errors.history?.message}
                  </p>
                )}
              </div>
            </div>
            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className="d-flex justify-content-end mb-5">
              <button
                className="btn btn-sm btn-danger p-2 ps-3 pe-3 me-3"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-primary p-2 ps-4 pe-4"
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

export default HymnCreate;
