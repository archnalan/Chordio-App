import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import BookBasicInfo from "./BookBasicInfo";
import BookDetailsInfo from "./BookDetailsInfo";
import PublicationInfo from "./PublicationInfo";
import AdditInfo from "./AdditInfo";
import BookInfoReview from "./BookInfoReview";
import {
  BookCreateSchema,
  HymnBookCreateModel,
} from "../../../../DataModels/HymnBookModel";
import { zodResolver } from "@hookform/resolvers/zod";

const BookRoutes: React.FC = () => {
  const methods = useForm<HymnBookCreateModel>({
    mode: "onChange",
    resolver: zodResolver(BookCreateSchema),
  });

  const onSubmit: SubmitHandler<HymnBookCreateModel> = (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <BrowserRouter>
          <Routes>
            <Route path="/songbooks/basicinfo" element={<BookBasicInfo />} />
            <Route
              path="/songbooks/bookdetails"
              element={<BookDetailsInfo />}
            />
            <Route
              path="/songbooks/publicationinfo"
              element={<PublicationInfo />}
            />
            <Route path="/songbooks/additionalinfo" element={<AdditInfo />} />
            <Route
              path="/songbooks/reviewdetails"
              element={
                <BookInfoReview onSubmit={methods.handleSubmit(onSubmit)} />
              }
            />
          </Routes>
        </BrowserRouter>
      </form>
    </FormProvider>
  );
};

export default BookRoutes;
