import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SongBasicInfo from "./SongBasicInfo";
import SongInfoReview from "./SongInfoReview";
import {
  HymnCreateModel,
  HymnCreateSchema,
} from "../../../../DataModels/HymnModel";
import { zodResolver } from "@hookform/resolvers/zod";
import SongAdditInfo from "./SongAdditInfo";
import SongRequest from "../../../../API/SongRequest";
import SongCreated from "./SongCreated";

const SongRoutes: React.FC = () => {
  const methods = useForm<HymnCreateModel>({
    mode: "onChange",
    resolver: zodResolver(HymnCreateSchema),
  });

  const [isSongCreated, setIsSongCreated] = useState(false);

  const onSubmit: SubmitHandler<HymnCreateModel> = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);

    try {
      const response = await SongRequest.createSong(data);
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<HymnCreateModel>= ~ response:",
        response.status
      );
      if (response && response.status === 201) {
        setIsSongCreated(true);
      }
    } catch (error) {
      console.error("🚀 ~ error:", error.response.data);
      if (error.response && error.response.data) {
        methods.setError("root", {
          message: error.response.data || "An Error occured at the server",
        });
      } else {
        methods.setError("root", {
          message: "An Unexpected Error occured. Please Try Again!",
        });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <BrowserRouter>
          <Routes>
            <Route path="/songs/basicinfo" element={<SongBasicInfo />} />
            <Route path="/songs/additinfo" element={<SongAdditInfo />} />
            <Route
              path="/songs/reviewdetails"
              element={
                <SongInfoReview
                  isSongCreated={isSongCreated}
                  setIsSongCreated={setIsSongCreated}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </form>
    </FormProvider>
  );
};

export default SongRoutes;
