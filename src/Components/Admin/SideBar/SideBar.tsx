import React, { useState } from "react";
import { LuChevronFirst, LuChevronLast, LuMoreVertical } from "react-icons/lu";
import { SideBarContext } from "../../Contexts/SideBarContext";
import { RxDashboard } from "react-icons/rx";
import "./Sidebar.css";

type sideProps = {
  children: React.ReactNode;
};
const SideBar: React.FC<sideProps> = ({ children }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  return (
    <aside className="vh-100">
      <nav className="h-100 d-flex flex-column position-relative bg-white border-end shadow-sm">
        <div className="p-4 pb-2 d-flex justify-content-between align-items-center">
          <div
            className={`d-flex justify-content-start align-items-center sidebar-item-text ${
              expanded ? "expanded" : "collapsed"
            }`}
          >
            <RxDashboard size={30} className="me-3" />
            <div>
              <h5>Dashbord</h5>
            </div>
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="btn btn-light p-1.5 rounded"
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SideBarContext.Provider value={{ expanded }}>
          <ul className="flex-grow-1 list-unstyled ">{children}</ul>
        </SideBarContext.Provider>

        <div className="border-top d-flex p-3 bg-white ">
          <img
            src=""
            alt="profile"
            className="rounded-circle"
            style={{ width: "40px", height: "40px" }}
          />
          <div
            className={`sidebar-item-text ${
              expanded ? "expanded" : "collapsed"
            }`}
          >
            <div className="d-flex align-items-center text-truncate ">
              <div className="d-flex flex-column">
                <h4 className="fw-semibold">Nalan</h4>
                <span className="text-muted small">archnalan@gmail.com</span>
              </div>
              <LuMoreVertical size={30} />
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};
export default SideBar;
