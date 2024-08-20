import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { idSchema } from "../../../DataModels/ValidateID";
import CategoryRequest from "../../../API/CategoryRequest";
import {
  CategoryModel,
  CategorySchema,
} from "../../../DataModels/CategoryModel";

const CategoryDetails: React.FC = () => {
  const [category, setCategory] = useState<CategoryModel>({
    id: 0,
    name: "",
    categorySlug: "",
    parentCategoryId: null,
    sorting: 0,
  });

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await CategoryRequest.fetchSpecificCategory(
          validatedId
        );

        const songResult = CategorySchema.safeParse(response.data);
        if (songResult.success) {
          setCategory(songResult.data);
        } else {
          console.error("🚀 ~ ValidationError:", songResult.error);
        }
      } catch (error) {
        console.error("🚀 ~ getCategory ~ error:", error);
      }
    };
    getCategory();
  }, []);

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

  return (
    <div className="vh-100 d-flex flex-column justify-content-start align-items-center bg-light m-3 ">
      <div className="w-50 border bg-white px-5 pt-3 pb-3 rounded">
        <h1 className="mb-5">Category Details</h1>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Name</strong>
          <span>{category.name}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Slug</strong>
          <span>{category.categorySlug}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Sorting</strong>
          <span>{category.sorting}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>ParentCategory</strong>
          <span>
            {
              categories.find((cat) => cat.id === category.parentCategoryId)
                ?.name
            }
          </span>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Link to={"/admin/categories"} className="btn btn-danger me-2">
            Back
          </Link>
          <Link to={`/admin/categories/edit/${id}`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
