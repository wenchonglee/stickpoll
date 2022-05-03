import axios from "axios";

export const Axios = axios.create({
  // baseURL: "http://localhost:3000/dev/",
  baseURL: "https://8b0tam808g.execute-api.ap-southeast-1.amazonaws.com/dev/",
});
