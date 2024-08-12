import axios, { AxiosResponse } from "axios";

const base_url = `https://localhost:7077/admin/api_chords`;


const fetchAllChords = async () : Promise<AxiosResponse> =>{
    const response = await axios.get(base_url);
    return response;
}

const fetchSpecificChord = async (id:number) : Promise<AxiosResponse> =>{
    try{
        const response = await axios.get(`${base_url}/${id}`);
        return response;

    }catch(error){
        throw new Error (`Error finding chord: ${error}`);
    }
}

const fetchChordWithCharts = async (id:number) =>{
    try{
        const response = await axios.get(`${base_url}/chords/${id}`)
        return response;

    }catch(error){
        throw new Error (`Error getting Chord with Charts: ${error}`)
    }
}
export default {
    fetchAllChords,
    fetchSpecificChord,
    fetchChordWithCharts,
}