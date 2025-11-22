import axios from "axios";


const BASE_URL = "http://localhost:8000";
export const get = async (path: string): Promise<unknown> => {
    return await axios.get(`${BASE_URL}/api/${path}`);
}