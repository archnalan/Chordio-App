import React from "react";
import ReactPaginate from "react-paginate";
import { GrNext, GrPrevious } from "react-icons/gr";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, onPageChange }) => {
  const handlePageClick = (data: { selected: number }) => {
    onPageChange(data.selected);
  };

  return (
    <ReactPaginate
      previousLabel={<GrPrevious />}
      nextLabel={<GrNext />}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      containerClassName={
        "w-50 pagination pagination-sm position-fixed bottom-0 justify-content-end border"
      }
      pageClassName={"page-item"}
      pageLinkClassName={"page-link "}
      activeClassName={"active"}
      nextLinkClassName={"page-link "}
      nextClassName={"page-item"}
      nextAriaLabel="Next"
      previousLinkClassName={"page-link"}
      previousClassName={"page-item"}
      previousAriaLabel="Previous"
      breakLinkClassName={"page-link"}
    />
  );
};

export default Pagination;
