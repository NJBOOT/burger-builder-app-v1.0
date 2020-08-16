import axios from "axios";

const instance = axios.create({
  baseURL: "https://burger-builder-7c82e.firebaseio.com/",
});

export default instance;
