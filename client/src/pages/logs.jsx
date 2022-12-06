import axios from "axios";
import React, { useEffect, useState } from "react";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const getLogs = async () => {
      const logsQuery = {
        query: `query {
          queryLogs {
            message
            level
            timestamp
          }
        }`,
        variables: {},
      };

      const headers = {
        "content-type": "application/json",
      };

      axios({
        baseURL: process.env.REACT_APP_base_url,
        method: "post",
        headers: headers,
        data: logsQuery,
      })
        .then((response) => {
          if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
          } else {
            return response;
          }
        })
        .then((response) => {
          let tmp = [];
          response.data.data.queryLogs.forEach((log) => {
            tmp.push({
              message: log.message,
              level: log.level,
              timestamp: log.timestamp,
              events: log.message.split(" | "),
            });
          });
          setLogs(tmp);
          console.log(tmp);
        })
        .catch((error) => console.log(error));
    };

    getLogs();
  }, []);
};

export default Logs;
