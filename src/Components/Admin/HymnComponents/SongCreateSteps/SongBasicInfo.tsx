import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { HymnCreateModel } from "../../../../DataModels/HymnModel";
import SongHeader from "./SongHeader";
import {
  CategoryModel,
  CategorySchema,
} from "../../../../DataModels/CategoryModel";
import CategoryRequest from "../../../../API/CategoryRequest";

const SongBasicInfo: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useFormContext<HymnCreateModel>();

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await CategoryRequest.fetchAllCategories();

      const validatedCategories = CategorySchema.array().safeParse(
        response.data.$values
      );
      if (!validatedCategories.success) {
        console.error(
          "🚀 ~ fetchCategories ~ validatedCategories.error:",
          validatedCategories.error
        );
        return;
      }
      setCategories(validatedCategories.data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded ">
        <SongHeader />
        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="number" className="fs-5">
            <strong>Number</strong>
          </label>
          <div className="w-75 flex-column">
            <input
              {...register("number", {
                setValueAs: (value: string) => parseInt(value, 10), // Convert string to number
              })}
              onBlur={() => {
                trigger("number");
              }}
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
          <label htmlFor="title" className="fs-5">
            <strong>Title</strong>
          </label>
          <div className="w-75 flex-column">
            <input
              type="text"
              className="w-100 form-control "
              {...register("title")}
            />
            {errors.title && (
              <p className="text-danger text-sm">{errors.title.message}</p>
            )}
          </div>
        </div>

        <div className="mb-3 d-flex justify-content-between">
          <label htmlFor="hymnTitle" className="fs-5">
            <strong>Category</strong>
          </label>
          <div className="w-75 flex-column">
            <select
              {...register("categoryId", {
                setValueAs: (v: string) => (v === "" ? null : Number(v)),
              })}
              onChange={(e) => {
                setValue("categoryId", Number(e.target.value));
                setValue(
                  "categoryName",
                  categories.find((cat) => cat.id === Number(e.target.value))
                    ?.name
                );
              }}
              value={watch("categoryId")}
              name="category"
              id="category-select"
              className="w-100 form-select form-select-lg"
            >
              <option value="">Pick a Category</option>
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

        <div className="d-flex justify-content-end mb-5">
          <button
            className="w-75 btn btn-sm fs-5 btn-primary p-2"
            onClick={() => navigate("/songs/additinfo")}
            disabled={!isValid}
          >
            Next
          </button>
        </div>
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </div>
    </div>
  );
};

export default SongBasicInfo;
