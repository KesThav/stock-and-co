import autocannon from "autocannon";
import { orders } from "../data/orders.js";
import { users } from "../data/users.js";

export const getUsersBenchmark = async (args) => {
  const { connections, pipelining, duration, workers } = args;
  const instance = await autocannon({
    url: "http://localhost:8082",
    connections: connections,
    pipelining: pipelining,
    duration: duration,
    workers: workers,
    requests: [
      {
        method: "POST",
        path: "/graphql",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          query: `query {
            users {
              name
              email
              points
            }
          }`,
        }),
      },
    ],
  });
  return instance;
};

export const createOrderBenchmark = async (args) => {
  const { connections, pipelining, duration, workers } = args;

  const variables = orders[0];
  const instance = autocannon({
    url: "http://localhost:8083/graphql",
    connections: connections,
    pipelining: pipelining,
    duration: duration,
    workers: workers,
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: `mutation startOrder($userid: String, $order:OrderInput,$ptype: String, $orderid:String){
            startOrder(userid:$userid,order:$order,ptype:$ptype,orderid:$orderid) {
              message
              __typename
            }
          }`,
      variables,
    }),
  });

  instance.on("response", console.log); // log response to console

  instance.on("done", () => {
    console.log("Test finished");
  });

  await instance.start();
  return instance;
};
