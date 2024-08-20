import React from "react";
import { useNavigate } from "react-router-dom";

type popUPMessage = {
  pageTitle: string;
  setOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};
const PageSuccess: React.FC<popUPMessage> = ({ pageTitle, setOpenSuccess }) => {
  const navigate = useNavigate();

  return (
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-fixed bg-dark bg-opacity-50 z-100">
      <div className="w-50 d-flex flex-column  relative border bg-white shadow px-5 pt-3 pd-5 rounded">
        <div className="w-100 d-flex absolute justify-content-between">
          <div></div>
          <button
            className="btn rounded-circle"
            onClick={() => {
              setOpenSuccess(false);
              navigate("/admin/pages");
            }}
          >
            <span className="fs-1 text-danger">&times;</span>
          </button>
        </div>
        <p className="fs-3 mb-4">
          <strong>{pageTitle}</strong> page has been created successfully!
        </p>
        <div>
          <button
            className="btn btn-sm btn-primary fs-4 p-2 ps-4 pe-4 mb-4"
            onClick={() => {
              navigate("/admin/pages");
              () => setOpenSuccess(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageSuccess;
