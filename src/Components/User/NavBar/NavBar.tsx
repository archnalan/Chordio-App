import "./NavBar.css";
import { useState, useEffect } from "react";
import PageService from "../../../API/PageService";
import Logo_light from "../../../assets/logo_light.png";
import Logo_dark from "../../../assets/logo_dark.png";
import Search_light from "../../../assets/search-b.png";
import Search_dark from "../../../assets/search-w.png";
import T_Dark from "../../../assets/night.png";
import T_Light from "../../../assets/day.png";
import PropTypes from "prop-types";
import { useThemeContext } from "../../Contexts/ThemeContext";
import { PageModel, PageSchema } from "../../../DataModels/PageModel";

const { fetchAllPages } = PageService;

const NavBar = () => {
  const { theme, setTheme } = useThemeContext();
  const [pages, setPages] = useState<PageModel[]>([]);
  const [error, setError] = useState(null);

  const toggle_mode = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetchAllPages();
        console.log("🚀 ~ fetchPages ~ response:", response);

        const pageResult = PageSchema.array().safeParse(response.data.$values);

        if (!pageResult.success) {
          console.error(
            "🚀 ~ fetchPages ~ pageResult.error:",
            pageResult.error
          );
        } else {
          console.log("🚀 ~ fetchPages ~ pageResult.data:", pageResult.data);
          setPages(pageResult.data.slice(0, 4)); // the first 4 pages from the db
        }
      } catch (error) {
        console.error("🚀 ~ fetchPages ~ error:", error);
      }
    };

    fetchPages();
  }, []);

  return (
    <div className="nav_bar">
      <img
        src={theme == "light" ? Logo_light : Logo_dark}
        alt=""
        className="logo"
      />
      <ul>
        {pages.map((page) => (
          <li key={page.id}>{page.title}</li>
        ))}
      </ul>
      <div className="search_box">
        <input type="text" placeholder="search" />
        <img src={theme == "light" ? Search_dark : Search_light} alt="" />
      </div>
      <img
        onClick={() => toggle_mode()}
        src={theme == "light" ? T_Dark : T_Light}
        alt=""
        className="toggle_icon"
      />
    </div>
  );
};

NavBar.propTypes = {
  theme: PropTypes.string,
  setTheme: PropTypes.func,
};

export default NavBar;
