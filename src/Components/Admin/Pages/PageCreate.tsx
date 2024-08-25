import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PageCreateModel,
  PageCreateSchema,
} from "../../../DataModels/PageModel";
import PageSuccess from "./PageSuccess";
import PageRequest from "../../../API/PageRequest";
import { Link } from "react-router-dom";

const PageCreate: React.FC = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PageCreateModel>({
    resolver: zodResolver(PageCreateSchema),
    mode: "all",
  });

  const [openSuccess, setOpenSuccess] = useState(false);

  const onSubmit = async (data: PageCreateModel) => {
    console.log("🚀 ~ sendCategoryData ~ hymnCategory:", data);
    try {
      const response = await PageRequest.createPage(data);

      console.log("🚀 ~ sendCategoryData ~ response:", response);

      if (response.status === 201) {
        setOpenSuccess(true);
      }
    } catch (error) {
      console.error("Error Sending Data", error);
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light ">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded mt-3">
        <h1 className="mb-3">Create a Page</h1>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="title" className="fs-5">
                <strong>Title</strong>
              </label>
              <div className="w-75">
                <input
                  type="text"
                  className=" form-control "
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-danger text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-between">
              <label htmlFor="title" className="fs-5">
                <strong>Content</strong>
              </label>
              <div className="w-75">
                <input
                  type="text"
                  className=" form-control "
                  placeholder="about page..."
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-danger text-sm">
                    {errors.content.message}
                  </p>
                )}
              </div>
            </div>

            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            <div className="d-flex justify-content-end mb-5">
              <Link to="/admin/pages">
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
      {openSuccess && (
        <PageSuccess
          pageTitle={watch().title}
          setOpenSuccess={setOpenSuccess}
        />
      )}
    </div>
  );
};

export default PageCreate;
