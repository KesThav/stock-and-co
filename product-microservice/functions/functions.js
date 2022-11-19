import Product from "../model/product.model.js";

export const getAllProducts = async () => {
  const allProducts = await Product.find();

  return allProducts;
};

export const getProduct = async (id) => {
  if (id.length !== 24) throw new Error("Id is not in correct format !");
  const oneProduct = await Product.findById({
    _id: id,
  });

  if (oneProduct) {
    return oneProduct;
  } else {
    throw new Error("No product found !");
  }
};

export const addProduct = async (args) => {
  let imageArray = [];
  if (args.images && args.images.length !== 0) {
    for (let i = 0; i < args.images.length; i++) {
      imageArray.push({ url: args.images[i] });
    }
  }
  const newProduct = new Product({
    name: args.name,
    description: args.description,
    type: args.type,
    quantity: args.quantity,
    price: args.price,
    averageRating: args.averageRating ? args.averageRating : 0,
    images: args.images && args.images.length !== 0 ? imageArray : [],
  });

  await newProduct.save();
  return newProduct;
};

export const updateProduct = async (args) => {
  if (args._id.length !== 24) throw new Error("Id is not in correct format !");

  let imageArray = [];
  if (args.images && args.images.length !== 0) {
    for (let i = 0; i < args.images.length; i++) {
      imageArray.push({ url: args.images[i] });
    }
  }

  let update = {};
  if (args.name) update["name"] = args.name;
  if (args.description) update["description"] = args.description;
  if (args.type) update["type"] = args.type;
  if (args.quantity) update["quantity"] = args.quantity;
  if (args.price) update["price"] = args.price;
  if (args.averageRating) update["averageRating"] = args.averageRating;
  if (args.images && args.images.length !== 0) update["images"] = imageArray;

  const updateProduct = await Product.findOneAndUpdate(
    {
      _id: args._id,
    },
    update,
    { new: true }
  );

  return updateProduct;
};

export const deleteProduct = async (id) => {
  const deletedProduct = await Product.findOneAndDelete({ _id: id });
  return deletedProduct;
};
