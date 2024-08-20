import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryModel,
  CategorySchema,
} from "../../../DataModels/CategoryModel";
import CategoryRequest from "../../../API/CategoryRequest";
import CategorySuccess from "./CategorySuccess";

const CategoryCreate: React.FC = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryModel>({
    resolver: zodResolver(CategorySchema),
    mode: "all",
    defaultValues: {
      id: 0,
      sorting: 100,
    },
  });

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [openSuccess, setOpenSuccess] = useState(false);

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
    console.log("🚀 ~ sendCategoryData ~ hymnCategory:", data);
    try {
      const response = await CategoryRequest.createCategory(data);

      console.log("🚀 ~ sendCategoryData ~ response:", response);

      if (response.status === 201) {
        setOpenSuccess(true);
      }
    } catch (error) {
      console.error("Error Sending Data", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-start bg-light ">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded mt-3">
        <h1 className="mb-3">Create a Category</h1>
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
                <strong>Category</strong>
              </label>
              <div className="w-75 flex-column">
                <select
                  {...register("parentCategoryId", {
                    setValueAs: (v: string) => (v === "" ? null : Number(v)),
                  })}
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
      {openSuccess && (
        <CategorySuccess
          categoryName={watch().name}
          setOpenSuccess={setOpenSuccess}
        />
      )}
    </div>
  );
};

export default CategoryCreate;
