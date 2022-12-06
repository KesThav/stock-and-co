import axios from "axios";

//all the functions to start camunda with axios
const getUserTasks = (id) => {
  //get all the tasks for a user
  return axios.get(`http://localhost:8080/engine-rest/task`);
};
