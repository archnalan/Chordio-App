import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useState } from "react";
import ThemeContext, { Theme } from "./Components/Contexts/ThemeContext";

import AdminRoutes from "./Components/Routes/AdminRoutes";
import BookRoutes from "./Components/Admin/HymnComponents/BookCreateSteps/BookRoutes";
import SongRoutes from "./Components/Admin/HymnComponents/SongCreateSteps/SongRoutes";

function App() {
  const currentTheme = localStorage.getItem("current_theme") as Theme | null;
  const [theme, setTheme] = useState<Theme>(
    currentTheme ? currentTheme : "light"
  );

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BookRoutes></BookRoutes>
      <SongRoutes></SongRoutes>
      <AdminRoutes></AdminRoutes>
    </ThemeContext.Provider>
  );
}

export default App;
