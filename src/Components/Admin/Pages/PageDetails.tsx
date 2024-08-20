import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { idSchema } from "../../../DataModels/ValidateID";
import { PageModel, PageSchema } from "../../../DataModels/PageModel";
import PageRequest from "../../../API/PageRequest";

const PageDetails: React.FC = () => {
  const [page, setPage] = useState<PageModel>({
    id: 0,
    title: "",
    slug: null,
    content: "",
    sorting: 0,
  });

  const { id } = useParams();

  useEffect(() => {
    const getPage = async () => {
      try {
        const validatedId = idSchema.parse(id);

        const response = await PageRequest.fetchPageById(validatedId);

        const songResult = PageSchema.safeParse(response.data);
        if (songResult.success) {
          setPage(songResult.data);
        } else {
          console.error("🚀 ~ ValidationError:", songResult.error);
        }
      } catch (error) {
        console.error("🚀 ~ getPage ~ error:", error);
      }
    };
    getPage();
  }, []);

  return (
    <div className="vh-100 d-flex flex-column justify-content-start align-items-center bg-light m-3 ">
      <div className="w-50 border bg-white px-5 pt-3 pb-3 rounded">
        <h1 className="mb-5">Page Details</h1>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Title</strong>
          <span>{page.title}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Slug</strong>
          <span>{page.slug}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Sorting</strong>
          <span>{page.sorting}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Content</strong>
          <span>{page.content}</span>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Link to={"/admin/pages"} className="btn btn-danger me-2">
            Back
          </Link>
          <Link to={`/admin/pages/edit/${id}`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageDetails;
