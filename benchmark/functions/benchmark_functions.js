export const getUser_GraphQL = () => {
  const usersQuery = {
    query: `query {
      users {
        name
        email
        points
        _id
      }
    }`,
    variables: {},
  };
  const headers = {
    "content-type": "application/json",
  };
  const queryContent = {
    url: "http://localhost:8082/graphql",
    method: "post",
    headers: headers,
    data: usersQuery,
  };

  return queryContent;
};

export const getOrders_GraphQL = () => {
  const orderQuery = {
    query: `query {
      orders {
        userid
        products {
          productid
          price
          quantity
        }
        total
        status
        type
        orderid
      }
    }
    `,
    variables: {},
  };
  const headers = {
    "content-type": "application/json",
  };
  const queryContent = {
    url: "http://localhost:8083/graphql",
    method: "post",
    headers: headers,
    data: orderQuery,
  };

  return queryContent;
};

export const getProducts_GraphQL = () => {
  const productQuery = {
    query: `query {
      products {
        _id
        name
        description
        type
        averageRating
        quantity
        price
        images {
          url
        }
      }
    }`,
    variables: {},
  };
  const headers = {
    "content-type": "application/json",
  };
  const queryContent = {
    url: "http://localhost:8084/graphql",
    method: "post",
    headers: headers,
    data: productQuery,
  };

  return queryContent;
};

export const createProduct_GraphQL = () => {
  const createProductMutation = {
    query: `mutation addProduct($name:String!,$description:String!,$type:String!,$averageRating:Int, $quantity:Int!,$price:Float!,$images:[String]) {
    addProduct(name:$name,description:$description,type:$type,averageRating:$averageRating,quantity:$quantity,price:$price,images:$images) {
      name
      description
      type
      averageRating
      quantity
      price
      images {
        url
      }
    }
  }`,
    variables: {
      name: "V15 Gen 2",
      description: "'15.60 \", Intel Core i3-1115G4, 8 Go, 256 Go, CH'",
      type: "Ordinateur portable",
      averageRating: 4,
      price: 599,
      quantity: 10,
      images: [
        "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/7/7/dfbcfa48-2952-4a94-a27f-0ed09c3312ea.jpg",
        "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/7/8/95763f79-aa6e-426d-8f5e-fedb7fc31ba1.jpg",
        "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/7/9/9e565b50-f254-44e8-b475-ab142c2c84f5.jpg",
        "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/8/0/Lenovo_V15_G2_ITL_CT2_02.jpeg",
      ],
    },
  };

  const headers = {
    "content-type": "application/json",
  };

  const queryContent = {
    url: "http://localhost:8084/graphql",
    method: "post",
    headers: headers,
    data: createProductMutation,
  };

  return queryContent;
};

export const getProductBoughtByUser_GraphQL = () => {
  const productBoughtQuery = {
    query: `{
      products {
        _id
        name
        description
        type
        averageRating
        quantity
        price
        images {
          url
        }
        orderList {
          userDetails {
            _id
            name
            email
            points
          }
        }
      }
    }`,
    variables: {},
  };

  const headers = {
    "content-type": "application/json",
  };

  const queryContent = {
    url: "http://localhost:4000/graphql",
    method: "post",
    headers: headers,
    data: productBoughtQuery,
  };

  return queryContent;
};

export const getProductBoughtByUser_GraphQL_2 = () => {
  const queryWithVariable = {
    query: `query {
      getProductBoughtByUser {
        message
      }
    }`,
    variables: {},
  };

  const headers = {
    "content-type": "application/json",
  };
  const queryContent = {
    url: "http://localhost:10000/graphql",
    method: "post",
    headers: headers,
    data: queryWithVariable,
  };

  return queryContent;
};
