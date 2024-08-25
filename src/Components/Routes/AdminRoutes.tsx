import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ChartEdit from "../Admin/ChordCharts/ChartEdit";
import ChartDetails from "../Admin/ChordCharts/ChartDetails";
import ChartCreate from "../Admin/ChordCharts/ChartCreate";
import ChordChart from "../Admin/ChordCharts/ChordChart";
import Chord from "../Admin/Chords/Chord";
import CategoryDetails from "../Admin/Categories/CategoryDetails";
import CategoryEdit from "../Admin/Categories/CategoryEdit";
import CategoryCreate from "../Admin/Categories/CategoryCreate";
import Category from "../Admin/Categories/Category";
import HymnCreate from "../Admin/HymnComponents/HymnCreate";
import SongEdit from "../Admin/HymnComponents/SongEdit";
import SongDetails from "../Admin/HymnComponents/SongDetails";
import Song from "../Admin/HymnComponents/Song";
import PageEdit from "../Admin/Pages/PageEdit";
import PageDetails from "../Admin/Pages/PageDetails";
import PageCreate from "../Admin/Pages/PageCreate";
import NavBar from "../User/NavBar/NavBar";
import Page from "../Admin/Pages/Page";
import Side from "../Admin/SideBar/Side";
import "./AdminLayout.css";
import ChordDetails from "../Admin/Chords/ChordDetails";
import SongBook from "../Books/SongBook";
import BookBasicInfo from "../Books/BookCreateSteps/BookBasicInfo";

const AdminRoutes: React.FC = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 bg-ligt top-nav">
          <NavBar />
        </div>
        <div className="row">
          <div className="col-2 bg-secondary side-nav">
            <Side />
          </div>
          <div className="col-10 bg-white main-content">
            <BrowserRouter>
              <Routes>
                <Route path="/admin/pages" element={<Page />}></Route>
                <Route
                  path="/admin/pages/create"
                  element={<PageCreate />}
                ></Route>
                <Route
                  path="/admin/pages/:id"
                  element={<PageDetails />}
                ></Route>
                <Route
                  path="/admin/pages/edit/:id"
                  element={<PageEdit />}
                ></Route>
                <Route path="/admin/songbooks" element={<SongBook />}></Route>
                {/* <Route
                  path="/admin/songbooks/create"
                  element={<BookBasicInfo />}
                ></Route> */}
                {/* <Route path="/" element={<SectionInput />}></Route> */}
                <Route path="/admin/songs" element={<Song />}></Route>
                <Route
                  path="/admin/songs/:id"
                  element={<SongDetails />}
                ></Route>
                <Route
                  path="/admin/songs/edit/:id"
                  element={<SongEdit />}
                ></Route>
                <Route
                  path="/admin/songs/create"
                  element={<HymnCreate />}
                ></Route>
                <Route path="/admin/categories" element={<Category />}></Route>
                <Route
                  path="/admin/categories/create"
                  element={<CategoryCreate />}
                ></Route>
                <Route
                  path="/admin/categories/edit/:id"
                  element={<CategoryEdit />}
                ></Route>
                <Route
                  path="/admin/categories/:id"
                  element={<CategoryDetails />}
                ></Route>

                <Route path="/admin/chords" element={<Chord />}></Route>
                <Route
                  path="/admin/chords/:id"
                  element={<ChordDetails />}
                ></Route>
                <Route
                  path="/admin/chordcharts"
                  element={<ChordChart />}
                ></Route>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;
