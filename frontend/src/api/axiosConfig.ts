import axios from "axios";

export const Axios = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:3000/dev/"
    : "https://8b0tam808g.execute-api.ap-southeast-1.amazonaws.com/dev/",
});
