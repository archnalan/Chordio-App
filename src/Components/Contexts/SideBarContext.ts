import { createContext, useContext } from "react";

type sideBarStatus = {
  expanded: boolean,
  /* setExpanded: React.Dispatch<React.SetStateAction<boolean>>, */
}
export const SideBarContext = createContext<sideBarStatus | undefined>(undefined);

export const useSideBarContext = () => {
  const context = useContext(SideBarContext);

  if (!context) {
    throw new Error("useSideBarContext must be used within a SideBarProvider");
  }

  return context;
};