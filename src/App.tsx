import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SectionInput from "./Components/Admin/Sections/SectionInput";
import Song from "./Components/Admin/HymnComponents/Song";
import HymnCreate from "./Components/Admin/HymnComponents/HymnCreate";
import HymnBook from "./Components/Admin/HymnComponents/HymnBook";
import BookCreate from "./Components/Admin/HymnComponents/BookCreate";
import ChordChart from "./Components/Admin/ChordCharts/ChordChart";
import ChartCreate from "./Components/Admin/ChordCharts/ChartCreate";
import NavBar from "./Components/User/NavBar/NavBar";
import ThemeContext, { Theme } from "./Components/Contexts/ThemeContext";
import ChartDetails from "./Components/Admin/ChordCharts/ChartDetails";
import ChartEdit from "./Components/Admin/ChordCharts/ChartEdit";
import SongDetails from "./Components/Admin/HymnComponents/SongDetails";
import SongEdit from "./Components/Admin/HymnComponents/SongEdit";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavBar />}></Route>
          {/* <Route path="/" element={<SectionInput />}></Route> */}
          <Route path="/admin/songbooks" element={<HymnBook />}></Route>
          <Route
            path="/admin/songbooks/create"
            element={<BookCreate />}
          ></Route>
          <Route path="/admin/songs" element={<Song />}></Route>
          <Route path="/admin/songs/:id" element={<SongDetails />}></Route>
          <Route path="/admin/songs/edit/:id" element={<SongEdit />}></Route>
          <Route path="/admin/songs/create" element={<HymnCreate />}></Route>
          <Route path="/admin/chordcharts" element={<ChordChart />}></Route>
          <Route
            path="/admin/chordcharts/create"
            element={<ChartCreate />}
          ></Route>
          <Route
            path="/admin/chordcharts/:id"
            element={<ChartDetails />}
          ></Route>
          <Route
            path="/admin/chordcharts/edit/:id"
            element={<ChartEdit />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
