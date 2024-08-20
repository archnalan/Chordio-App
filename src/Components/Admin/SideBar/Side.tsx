import React from "react";
import SideBar from "./SideBar";
import SidebarItem from "./SideBarItem";
import { ImBooks } from "react-icons/im";
import { MdLibraryBooks } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { SiApplemusic } from "react-icons/si";
import { GiMusicalScore } from "react-icons/gi";
import { SiMusicbrainz } from "react-icons/si";

const Side = () => {
  return (
    <>
      <SideBar>
        <SidebarItem
          icon={<MdLibraryBooks size={30} />}
          text="Pages"
          active
          alert
        />
        <SidebarItem icon={<ImBooks size={30} />} text="Collections" />
        <SidebarItem
          icon={<BiSolidCategoryAlt size={30} />}
          text="Categories"
        />
        <SidebarItem icon={<SiApplemusic size={30} />} text="Songs" alert />
        <SidebarItem icon={<SiMusicbrainz size={30} />} text="Chords" />
        <SidebarItem icon={<GiMusicalScore size={30} />} text="Chord Charts" />
      </SideBar>
    </>
  );
};

export default Side;
