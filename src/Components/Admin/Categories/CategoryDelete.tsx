import React from "react";

type popUPMessage = {
  title: string;
  categoryId: number;
  handleDelete: (name: string, id: number) => void;
  setOpenConfirm: React.Dispatch<React.SetStateAction<boolean>>;
};
const CategoryDelete: React.FC<popUPMessage> = ({
  handleDelete,
  title,
  categoryId,
  setOpenConfirm,
}) => {
  return (
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-fixed bg-dark bg-opacity-50 z-100">
      <div className="w-50 d-flex flex-column position-relative border bg-white shadow px-5 pt-3 pd-5 rounded">
        <div className="w-100 d-flex position-absolute top-0 end-0 justify-content-between align-items-end ">
          <div></div>
          <button
            className="btn btn-transparent fs-1 text-danger border-0  me-2"
            onClick={() => setOpenConfirm(false)}
          >
            &times;
          </button>
        </div>
        <p className="fs-3 mt-5 mb-5">
          Do you want to delete the category <strong>{title}</strong>?
        </p>
        <div className="d-flex justify-content-between mb-5">
          <button
            className="btn btn-sm btn-danger fs-5 p-2 ps-4 pe-4 "
            onClick={() => setOpenConfirm(false)}
          >
            No
          </button>
          <button
            className="btn btn-sm btn-primary fs-5 p-2 ps-4 pe-4 "
            onClick={() => {
              handleDelete(title, categoryId);
              setOpenConfirm(false);
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDelete;
