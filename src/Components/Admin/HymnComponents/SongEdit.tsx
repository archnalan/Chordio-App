import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  HymnCreateSchema,
  HymnWithCategory,
  HymnWithCategorySchema,
} from "../../../DataModels/HymnModel";
import { idSchema } from "../../../DataModels/ValidateID";
import SongRequest from "../../../API/SongRequest";
import CategoryRequest from "../../../API/CategoryRequest";
import {
  CategoryModel,
  CategorySchema,
} from "../../../DataModels/CategoryModel";
import YearRangePicker from "../../Helper/YearRangePicker";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ParseDateRange from "../../Helper/ParseDateRange";

const SongEdit: React.FC = () => {
  const {
    register,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HymnWithCategory>({
    mode: "all",
    resolver: zodResolver(HymnWithCategorySchema),
  });

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [dateRange, setDateRange] = useState<string | undefined>(undefined);
  const [songData, setSongData] = useState<HymnWithCategory | undefined>(
    undefined
  );

  /*  const { startYear, endYear } = ParseDateRange(dateRange); */

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getSong = async () => {
      try {
        const validatedId = idSchema.parse(id);
        const response = await SongRequest.fetchSpecificSong(validatedId);

        const songResult = HymnWithCategorySchema.safeParse(response.data);
        if (!songResult.success) {
          console.error("🚀 ~ getSong ~ songResult.error:", songResult.error);
          return;
        }
        setSongData(songResult.data);
      } catch (error) {
        console.error("Error fetching song", error);
      }
    };
    getSong();
  }, [id]);

  useEffect(() => {
    if (songData) {
      /* Setting the default form values*/
      setValue("id", songData.id);
      setValue("number", songData.number);
      setValue("title", songData.title);
      setValue("categoryId", songData.categoryId);
      setValue("categoryName", songData.categoryName);
      setValue("writtenDateRange", songData.writtenDateRange);
      setDateRange(songData.writtenDateRange);
      setValue("writtenBy", songData.writtenBy);
      setValue("history", songData.history);
    }
  }, [songData]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await CategoryRequest.fetchAllCategories();

        const categoryResult = CategorySchema.array().safeParse(
          response.data.$values
        );
        if (!categoryResult.success) {
          console.error(
            "🚀 ~ getCategories ~ categoryResult.error:",
            categoryResult.error
          );
          return;
        }
        setCategories(categoryResult.data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };
    getCategories();
  }, []);

  const onSubmit = async (data: HymnWithCategory) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const validatedSong = HymnCreateSchema.safeParse(data);
      console.log("🚀 ~ onSubmit ~ validatedSong:", validatedSong);

      /* const response = await axios.put(`${Requests.editSong}${id}`, song);

      console.log("🚀 ~ editSong ~  response:", response);
      navigate("/admin/songs", {
        state: {
          successMessage: `Song: ${song.title} updated successfully`,
        }, 
      });*/
    } catch (error) {
      console.error("Error Saving Song", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h1 className="mb-4">Edit a Song</h1>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="songNumber" className="fs-5">
                <strong>Number:</strong>
              </label>
              <div className="w-75">
                <input
                  type="number"
                  className="form-control btn btn-outline-secondary mb-2"
                  {...register("number", {
                    setValueAs: (v) => parseInt(v, 10),
                  })}
                  min="1"
                  step="1"
                />
                {errors.number && (
                  <p className="text-danger text-sm">{errors.number.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="songTitle" className="fs-5">
                <strong>Title:</strong>
              </label>
              <div className="w-75 ">
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
              <label htmlFor="songTitle" className="fs-5">
                <strong>Category:</strong>
              </label>
              <div className="w-75">
                <select
                  id="category-select"
                  {...register("categoryId", {
                    setValueAs: (v) => parseInt(v, 10),
                  })}
                  className="form-select"
                >
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.categoryId && (
                  <p className="text-danger text-sm">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="songAuthor" className="fs-5">
                <strong>Author:</strong>
              </label>
              <input
                type="text"
                className="w-75 form-control"
                {...register("writtenBy")}
              />
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="songWrittenDate" className="fs-5">
                <strong>Written Date:</strong>
              </label>
              <div className="w-75 ">
                <Controller
                  name="writtenDateRange"
                  defaultValue={dateRange}
                  control={control}
                  render={({ field }) => (
                    <YearRangePicker
                      yearStart={
                        field.value
                          ? parseInt(field.value.split("-")[0], 10)
                          : null
                      }
                      yearEnd={
                        field.value
                          ? parseInt(field.value.split("-")[1], 10)
                          : null
                      }
                      onChange={(range) => {
                        if (range) {
                          field.onChange(`${range[0]}-${range[1]}`);
                        } else {
                          field.onChange(null);
                        }
                      }}
                    />
                  )}
                />
                {errors.writtenDateRange && (
                  <p className="text-danger text-sm">
                    {errors.writtenDateRange.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="songHistory" className="fs-5">
                <strong>History:</strong>
              </label>
              <div className="w-75">
                <textarea
                  className=" form-control overflow-scroll "
                  {...register("history")}
                ></textarea>
                {errors.history && (
                  <p className="text-danger text-sm">
                    {errors.history.message}
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

export default SongEdit;
