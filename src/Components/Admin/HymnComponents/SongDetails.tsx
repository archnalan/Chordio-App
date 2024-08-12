import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Requests from "./Requests";
import {
  HymnSchema,
  HymnWithCategory,
  HymnWithCategorySchema,
} from "../../../DataModels/HymnModel";
import SongRequest from "../../../API/SongRequest";
import { idSchema } from "../../../DataModels/ValidateID";

const SongDetails = () => {
  const [Song, setSong] = useState<HymnWithCategory>({
    id: 0,
    number: 0,
    title: "",
    categoryId: 0,
    categoryName: "",
    writtenBy: "",
    writtenDateRange: "",
    history: "",
  });

  const { id } = useParams();

  useEffect(() => {
    const getSong = async () => {
      const validatedId = idSchema.parse(id);

      const response = await SongRequest.fetchSpecificSong(validatedId);

      const songResult = HymnWithCategorySchema.safeParse(response.data);
      if (!songResult.success) {
        console.error("🚀 ~ getSong ~ songResult.error:", songResult.error);
        return;
      }

      console.log("🚀 ~ getSong ~ response:", response);
      setSong(songResult.data);
    };
    getSong();
  }, []);

  useEffect(() => {
    if (Song) console.log(Song);
  }, [Song]);

  return (
    <div className="vh-100 d-flex flex-column justify-content-start align-items-center bg-light m-3 ">
      <div className="w-50 border bg-white px-5 pt-3 pb-3 rounded">
        <h1 className="mb-5">Song Details</h1>
        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Number</strong>
          <span>{Song.number}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Title</strong>
          <span>{Song.title}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Category</strong>
          <span>{Song.categoryName}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>Author</strong>
          <span>{Song.writtenBy}</span>
        </div>

        <div className="d-flex justify-content-between text-end mb-4">
          <strong>History</strong>
          <span>{Song.history}</span>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <Link to={"/admin/songs"} className="btn btn-danger me-2">
            Back
          </Link>
          <Link to={`/admin/songs/edit/${id}`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
