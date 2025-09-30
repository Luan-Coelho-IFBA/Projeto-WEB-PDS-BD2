import axios from "axios";

// const devMode = "http://localhost:3000";
const production = "http://18.231.94.165:3000";

const api = axios.create({
    baseURL: production,
});

export default api;
