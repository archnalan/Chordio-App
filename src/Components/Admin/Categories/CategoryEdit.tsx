import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { idSchema } from "../../../DataModels/ValidateID";
import CategoryRequest from "../../../API/CategoryRequest";
import {
  CategoryModel,
  CategorySchema,
} from "../../../DataModels/CategoryModel";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CategoryEditSuccess from "./CategoryEditSuccess";

const CategoryEdit: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryModel>({
    mode: "all",
    resolver: zodResolver(CategorySchema),
  });

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryModel | undefined>(
    undefined
  );
  const [openEditSuccess, setOpenEditSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const validatedId = idSchema.parse(id);
        const response = await CategoryRequest.fetchSpecificCategory(
          validatedId
        );

        const songResult = CategorySchema.safeParse(response.data);
        if (!songResult.success) {
          console.error("🚀 ~ getSong ~ songResult.error:", songResult.error);
          return;
        }
        setCategoryData(songResult.data);
      } catch (error) {
        console.error("Error fetching song", error);
      }
    };
    getCategory();
  }, [id]);

  useEffect(() => {
    if (categoryData) {
      /* Setting the default form values*/
      setValue("id", categoryData.id);
      setValue("name", categoryData.name);
      setValue("sorting", categoryData.sorting);
      setValue("parentCategoryId", categoryData.parentCategoryId);
      setValue("categorySlug", categoryData.categorySlug);
    }
  }, [categoryData]);

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

  const onSubmit = async (data: CategoryModel) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const validatedId = idSchema.parse(id);
      const validatedCategory = CategorySchema.safeParse(data);
      console.log("🚀 ~ onSubmit ~ validatedCategory:", validatedCategory);

      if (validatedCategory.success) {
        const response = await CategoryRequest.editCategory(
          validatedId,
          validatedCategory.data
        );
        console.log("🚀 ~ editSong ~  response:", response);
        if (response.status === 200) {
          setOpenEditSuccess(true);
        }
      }
    } catch (error) {
      console.error("Error Saving Song", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light mt-3">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded">
        <h1 className="mb-4">Edit a Category</h1>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="title" className="fs-5">
                <strong>Name</strong>
              </label>
              <div className="w-75">
                <input
                  type="text"
                  className=" form-control "
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-danger text-sm">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="hymnTitle" className="fs-5">
                <strong>Parent Category</strong>
              </label>
              <div className="w-75 flex-column">
                <select
                  {...register("parentCategoryId", {
                    setValueAs: (v: string) => (v === "" ? null : Number(v)),
                  })}
                  onChange={(e) => {
                    setValue("parentCategoryId", Number(e.target.value));
                  }}
                  id="category-select"
                  className="w-100 form-select"
                >
                  <option value="">No Parent Category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
                {errors.parentCategoryId && (
                  <p className="text-danger text-sm">
                    {errors.parentCategoryId.message}
                  </p>
                )}
              </div>
            </div>

            {/*  <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className="d-flex justify-content-end mb-5">
              <Link to="/admin/categories">
                <button className="btn btn-sm btn-danger p-2 me-2">
                  Cancel
                </button>
              </Link>
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
      {openEditSuccess && (
        <CategoryEditSuccess
          setOpenEditSuccess={setOpenEditSuccess}
          categoryName={watch().name}
        />
      )}
    </div>
  );
};

export default CategoryEdit;
