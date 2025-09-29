import axios from "axios";

const devMode = "http://localhost:3000";
// const production = "https://projeto-web-pds-bd2.onrender.com";

const api = axios.create({
    baseURL: devMode,
});

export default api;
