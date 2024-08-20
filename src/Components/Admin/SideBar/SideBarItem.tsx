import React from "react";
import { useSideBarContext } from "../../Contexts/SideBarContext";
import "./SidebarItem.css";

type ItemProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
};
const SidebarItem: React.FC<ItemProps> = ({ icon, text, active, alert }) => {
  const { expanded } = useSideBarContext();

  return (
    <li
      className={`slidebar-item ${
        active ? "bg-light text-primary" : "hover:bg-light text-secondary"
      }`}
    >
      {icon}
      <span
        className={`sidebar-item-text ${expanded ? "expanded" : "collapsed"}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`position-absolute end-0 w-2 h-2 rounded-circle bg-primary ${
            expanded ? "" : "top-0"
          }`}
        />
      )}
      {!expanded && <div className="tool-tip position-absolute">{text}</div>}
    </li>
  );
};

export default SidebarItem;
