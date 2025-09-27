import axios from "axios";

const api = axios.create({
    baseURL: "https://projeto-web-pds-bd2.onrender.com",
});

export default api;
