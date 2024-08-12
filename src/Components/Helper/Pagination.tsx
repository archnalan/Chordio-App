import React from "react";
import ReactPaginate from "react-paginate";

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
      previousLabel={"Previous"}
      nextLabel={"Next"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      containerClassName={"pagination pagination-sm justify-content-end"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      activeClassName={"active"}
      nextLinkClassName={"page-link"}
      nextClassName={"page-item"}
      previousLinkClassName={"page-link"}
      previousClassName={"page-item"}
      breakLinkClassName={"page-link"}
    />
  );
};

export default Pagination;
