import { BASE_URL } from "./constants";
import axios from "axios";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["Accept"] = "application/json";

export default axios;