import axios from "axios";

//all the functions to start camunda with axios
const escapeJSON = (obj) => {
  return JSON.stringify(obj)
    .replace(/[\\]/g, "\\\\")
    .replace(/[\"]/g, '\\"')
    .replace(/[\/]/g, "\\/")
    .replace(/[\b]/g, "\\b")
    .replace(/[\f]/g, "\\f")
    .replace(/[\n]/g, "\\n")
    .replace(/[\r]/g, "\\r")
    .replace(/[\t]/g, "\\t");
};

export const startInstance = (data) => {
  console.log(data);

  const { userid, order } = data;

  const variables = {
    userid: {
      value: userid,
    },
    order: {
      value: escapeJSON(order),
    },
  };

  console.log(variables);
};
