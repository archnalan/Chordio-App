import { HymnModel } from "../DataModels/HymnModel";
import API from "./API";

const apiEndpoints = {
  fetchAllSongs: 'admin/api_hymns/categories',  
  fetchSpecificSong: (id: number) => `admin/api_hymns/category/${id}`,
  createSong: 'admin/api_hymns/create',
  deleteSong: (id: number) => `admin/api_hymns/${id}`,
  editSong: (id: number) => `admin/api_hymns/edit/${id}`,
};

const fetchAllSongs = () => API.get(apiEndpoints.fetchAllSongs);
const fetchSpecificSong = (id: number) => API.get(apiEndpoints.fetchSpecificSong(id));
const createSong = (SongData: HymnModel) => API.post(apiEndpoints.createSong, SongData);
const deleteSong = (id: number) => API.delete(apiEndpoints.deleteSong(id));
const editSong = (id: number, SongData: HymnModel) => API.put(apiEndpoints.editSong(id), SongData);

export default {
  fetchAllSongs,  
  fetchSpecificSong,
  createSong,
  deleteSong,
  editSong,
};
