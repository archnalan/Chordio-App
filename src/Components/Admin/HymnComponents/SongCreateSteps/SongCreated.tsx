import React from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { HymnBookCreateModel } from "../../../../DataModels/HymnBookModel";

type popUPMessage = {
  setIsSongCreated: React.Dispatch<React.SetStateAction<boolean>>;
};
const SongCreated: React.FC<popUPMessage> = ({ setIsSongCreated }) => {
  const { watch, reset } = useFormContext<HymnBookCreateModel>();
  const songData = watch();
  const navigate = useNavigate();

  return (
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center position-fixed bg-dark bg-opacity-50 z-100">
      <div className="w-50 d-flex flex-column  relative border bg-white shadow px-5 pt-3 pd-5 rounded">
        <div className="w-100 d-flex absolute justify-content-between">
          <div></div>
          <button
            className="btn rounded-circle"
            onClick={() => {
              setIsSongCreated(false);
              navigate("/admin/songs");
            }}
          >
            <span className="fs-1 text-danger">&times;</span>
          </button>
        </div>
        <p className="fs-3 mb-4">
          Song <strong>{songData.title}</strong> has been created successfully!
        </p>
        <div>
          <button
            className="btn btn-sm btn-primary fs-4 p-2 ps-4 pe-4 mb-4"
            onClick={() => {
              reset();
              navigate("/admin/songs");
              () => setIsSongCreated(false);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongCreated;
