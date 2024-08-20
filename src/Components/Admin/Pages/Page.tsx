import React, { useEffect, useState } from "react";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FiList, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../../Helper/Pagination";
import PageRequest from "../../../API/PageRequest";
import { PageModel, PageSchema } from "../../../DataModels/PageModel";
import PageDelete from "./PageDelete";

const Page: React.FC = () => {
  const [pages, setPages] = useState<PageModel[]>([]);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [toDelete, setToDelete] = useState<PageModel | undefined>(undefined);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pagesPerPage] = useState(8);

  const [filteredPages, setfilteredPages] = useState<PageModel[]>([]);

  useEffect(() => {
    const getPages = async () => {
      try {
        const response = await PageRequest.fetchAllPages();

        const validatedSong = PageSchema.array().safeParse(
          response.data.$values
        );
        if (validatedSong.success) {
          setPages(validatedSong.data);
          setfilteredPages(validatedSong.data);
        }
      } catch (error) {
        console.error("🚀 ~ getPages ~ validatedSong.error:", error);
      }
    };
    getPages();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const searchQuery = e.target.value.toLowerCase();
    const normalizedQuery = searchQuery.replace(/^0+/, "");

    if (searchQuery != "") {
      if (pages) {
        const searchResult = pages.filter(
          (page) =>
            String(page.id).includes(searchQuery) ||
            String(page.sorting).includes(normalizedQuery) ||
            page.title.toLowerCase().includes(searchQuery) ||
            page.slug?.toLowerCase().includes(searchQuery) ||
            page.content.toLowerCase().includes(searchQuery)
        );
        setfilteredPages(searchResult);
        setCurrentPageIndex(0); //display results on first page
      }
    } else {
      setfilteredPages(pages);
    }
  };

  const handleDelete = (name: string, id: number) => {
    const deletePage = async () => {
      try {
        const response = await PageRequest.deletePage(id);

        console.log("🚀 ~ deletePage ~ response:", response);

        window.location.reload();
      } catch (error) {
        console.error("Error deleting Page", error);
        setOpenConfirm(false);
        setErrorDelete(`${name} could not be deleted. Try Again!`);
      }
    };
    deletePage();
  };
  const handlePageChange = (selected: number) => {
    setCurrentPageIndex(selected);
  };
  const pageCount = Math.ceil(filteredPages.length / pagesPerPage);
  const offset = currentPageIndex * pagesPerPage;
  const currentPages = filteredPages.slice(offset, offset + pagesPerPage);

  return (
    <div className="w-100 vh-100 position-fixed overflow-y-scroll bg-light ">
      <div className="d-flex flex-column justify-content-start align-items-center bg-light vh-100">
        <h1 className="m-3">List of Pages</h1>
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
                placeholder="find a page..."
                onChange={handleSearch}
              />
              <button className="btn btn-outline position-absolute ">
                <IoSearchOutline />
              </button>
            </div>
            <Link to="create" className="btn btn-success">
              <RiStickyNoteAddFill />
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-align-middle">
              <thead>
                <tr>
                  <td className="col-number">ID</td>
                  <td className="col-title">Title</td>
                  <td className="col-category">Content</td>
                  <td className="col-author">Sorting</td>
                  <td className="col-actions">Actions</td>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentPages.map((page) => (
                  <tr key={page.id}>
                    <td>{String(page.id).padStart(3, "0")}</td>
                    <td>{page.title}</td>
                    <td>{page.content}</td>
                    <td>{page.sorting}</td>
                    <td>
                      <Link
                        to={`${page.id}`}
                        className="btn btn-sm btn-info me-2"
                      >
                        <FiList />
                      </Link>
                      <Link
                        to={`edit/${page.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setToDelete(page);
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
          <PageDelete
            title={toDelete.title}
            pageId={toDelete.id}
            setOpenConfirm={setOpenConfirm}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
