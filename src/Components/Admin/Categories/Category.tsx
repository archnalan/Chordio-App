import React, { useEffect, useState } from "react";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { MessageSchema } from "../../../DataModels/MessageSchema";
import Pagination from "../../Helper/Pagination";
import CategoryDelete from "./CategoryDelete";
import CategoryRequest from "../../../API/CategoryRequest";
import {
  CategoryModel,
  CategorySchema,
} from "../../../DataModels/CategoryModel";

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<CategoryModel | undefined>(
    undefined
  );
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [categoriesPerPage] = useState(8);
  const location = useLocation();
  const navigate = useNavigate();

  const [filteredCategories, setfilteredCategories] = useState<CategoryModel[]>(
    []
  );

  useEffect(() => {
    const getCategories = async () => {
      const response = await CategoryRequest.fetchAllCategories();

      const validatedCategory = CategorySchema.array().safeParse(
        response.data.$values
      );
      if (!validatedCategory.success) {
        console.error(
          "🚀 ~ getCategories ~ validatedCategory.error:",
          validatedCategory.error.issues
        );
        return;
      }
      setCategories(validatedCategory.data);
      setfilteredCategories(validatedCategory.data);
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (location.state?.successMessage) {
      const successMessage = MessageSchema.parse(location.state.successMessage);
      console.log(
        "🚀 ~ useEffect ~ location.state?.successMessage:",
        successMessage
      );
      setSuccessMessage(successMessage);
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
      //clear the success state object
      navigate(location.pathname, { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (categories) {
        const searchResult = categories.filter(
          (category) =>
            String(category.parentCategoryId).includes(searchQuery) ||
            String(category.sorting).includes(normalizedQuery) ||
            category.name.toLowerCase().includes(searchQuery)
        );
        setfilteredCategories(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredCategories(categories);
    }
  };

  const handleDelete = (name: string, id: number) => {
    const deleteCategory = async () => {
      try {
        const response = await CategoryRequest.deleteCategory(id);

        console.log("🚀 ~ deleteCategory ~ response:", response);

        window.location.reload();
      } catch (error) {
        console.error("Error deleting Category", error);
        setOpenConfirm(false);
        setErrorDelete(`${name} could not be deleted. Try Again!`);
      }
    };
    deleteCategory();
  };
  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(filteredCategories.length / categoriesPerPage);
  const offset = currentPageIndex * categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    offset,
    offset + categoriesPerPage
  );

  return (
    <div className="w-100 vh-100 position-fixed overflow-y-scroll bg-light ">
      <div className="d-flex flex-column justify-content-start align-items-center bg-light vh-100">
        <h1 className="m-3">List of categories</h1>
        {successMessage && (
          <div className="w-75 alert alert-success text-wrap" role="alert">
            {successMessage}
          </div>
        )}
        {errorDelete && (
          <div className="w-75 alert alert-danger text-wrap" role="alert">
            {errorDelete}
          </div>
        )}
        <div className="w-75 rounded bg-white border-shadow p-3 ">
          <div className="d-flex justify-content-between mb-3">
            <div className="d-flex w-50 justify-content-start align-items-center position-relative me-5">
              <input
                type="text"
                className="form-control ps-5 rounded"
                placeholder="search a category..."
                onChange={handleSearch}
              />
              <button className="btn btn-outline position-absolute ">
                <IoSearchOutline />
              </button>
            </div>
            <Link to="/admin/categories/create" className="btn btn-success">
              <RiStickyNoteAddFill />
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-align-middle">
              <thead>
                <tr>
                  <td className="col-number">ID</td>
                  <td className="col-title">Name</td>
                  <td className="col-category">Category-slug</td>
                  <td className="col-author">Sorting</td>
                  <td className="col-actions">Actions</td>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentCategories.map((category) => (
                  <tr key={category.id}>
                    <td>{String(category.id).padStart(3, "0")}</td>
                    <td>{category.name}</td>
                    <td>{category.categorySlug}</td>
                    <td>{category.sorting}</td>
                    <td>
                      <Link
                        to={`${category.id}`}
                        className="btn btn-sm btn-info me-2"
                      >
                        <FiList />
                      </Link>
                      <Link
                        to={`edit/${category.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setToDelete(category);
                          setOpenConfirm(true);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="Page navigation">
            <Pagination pageCount={pageCount} onPageChange={handlePageChange} />
          </div>
        </div>
        {openConfirm && toDelete && (
          <CategoryDelete
            title={toDelete.name}
            categoryId={toDelete.id}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Category;
