import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { idSchema } from "../../../DataModels/ValidateID";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageSchema, PageModel } from "../../../DataModels/PageModel";
import PageRequest from "../../../API/PageRequest";
import PageEditSuccess from "./PageEditSuccess";

const PageEdit: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PageModel>({
    mode: "all",
    resolver: zodResolver(PageSchema),
  });

  const [pageData, setPageData] = useState<PageModel | undefined>(undefined);
  const [openEditSuccess, setOpenEditSuccess] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const validatedId = idSchema.parse(id);
        const response = await PageRequest.fetchPageById(validatedId);

        const pageResult = PageSchema.safeParse(response.data);
        if (!pageResult.success) {
          console.error("🚀 ~ getSong ~ songResult.error:", pageResult.error);
          return;
        }
        setPageData(pageResult.data);
      } catch (error) {
        console.error("Error fetching song", error);
      }
    };
    getCategory();
  }, [id]);

  useEffect(() => {
    if (pageData) {
      /* Setting the default form values*/
      setValue("id", pageData.id);
      setValue("title", pageData.title);
      setValue("sorting", pageData.sorting);
      setValue("content", pageData.content);
      setValue("slug", pageData.slug);
    }
  }, [pageData]);

  const onSubmit = async (data: PageModel) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const validatedId = idSchema.parse(id);
      const validatedCategory = PageSchema.safeParse(data);
      console.log("🚀 ~ onSubmit ~ validatedCategory:", validatedCategory);

      if (validatedCategory.success) {
        const response = await PageRequest.updatePage(
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
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light ">
      <div className="w-50 border bg-white shadow px-5 pt-3 pd-5 rounded mt-3">
        <h1 className="mb-4">Edit a Page</h1>

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
      {openEditSuccess && (
        <PageEditSuccess
          setOpenEditSuccess={setOpenEditSuccess}
          pageTitle={watch().title}
        />
      )}
    </div>
  );
};

export default PageEdit;
