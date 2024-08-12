import axios from "axios";
import React, { FC, useEffect, useState, ChangeEvent } from "react";

interface props {
  song: string;
}
const SongTitle: FC<props> = () => {
  const [song, SetSong] = useState<string>("");
  const [songsInDb, setSongsInDb] = useState<string[]>([]);
  const [songMatch, setSongMatch] = useState<string>("");

  useEffect(() => {
    try {
      const url = `https://localhost:7077/api/hymns`;

      const fetchSongs = async () => {
        const response = await axios.get(url);
        const parsedSongData = await response.data.$values;
        setSongsInDb(parsedSongData);
        console.log("🚀 ~ fetchSongs ~ response:", parsedSongData.title);
      };
      fetchSongs();
    } catch (error) {
      console.log("🚀 ~ useEffect ~ error:", error);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const addedSong = e.target.value;
    console.log("🚀 ~ handleChange ~ addedSong:", addedSong);
    SetSong(addedSong);
  };
  return (
    <div>
      <input
        type="text"
        onChange={handleChange}
        placeholder="Add song title..."
      />
      {songsInDb.title === song && (
        <div>
          <p>{song}</p>
        </div>
      )}
    </div>
  );
};

export default SongTitle;
