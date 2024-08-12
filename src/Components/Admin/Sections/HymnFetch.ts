import axios, { AxiosResponse } from "axios"
import { HymnSchema } from "./HymnModel";
import { z } from "zod";

const API_BaseUrl = `https://localhost:7077/admin/api_hymns`;
type Hymn = z.infer<typeof HymnSchema>;

export const fetchAllHymns = async (): Promise<AxiosResponse<Hymn[]>> =>{
    try{
        const response = await axios.get<Hymn[]>(API_BaseUrl);
        return response;
    }
    catch(error){
        throw new Error(`Error fetching hymns ${error}`);
    }
}

export const fetchSpecificHymn = async (id:number) :Promise<AxiosResponse<Hymn>>=>{
    try{
        const response = await axios.get<Hymn>(`${API_BaseUrl}${id}`);
        return response;

    }
    catch(error){
        throw new Error (`Error fetching hymn with ID ${id}: ${error}`);
    }
}

export default {   
    fetchAllHymns,
    fetchSpecificHymn,
}