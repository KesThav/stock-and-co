// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace ProductsTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** All queries */
export type Query = {
  /** A single product */
  product?: Maybe<Product>;
  /** List all products */
  products?: Maybe<Array<Maybe<Product>>>;
};


/** All queries */
export type QueryproductArgs = {
  id?: InputMaybe<Scalars['String']>;
};

/** This represents a product */
export type Product = {
  _id?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description: Scalars['String'];
  type: Scalars['String'];
  averageRating?: Maybe<Scalars['Float']>;
  quantity: Scalars['Int'];
  price: Scalars['Float'];
  images?: Maybe<Array<Maybe<images>>>;
};

/** This represents a product image */
export type images = {
  url?: Maybe<Scalars['String']>;
};

/** All mutations */
export type Mutation = {
  /** add product */
  addProduct?: Maybe<Product>;
  /** update product */
  updateProduct?: Maybe<Product>;
  /** delete product */
  deleteProduct?: Maybe<Product>;
};


/** All mutations */
export type MutationaddProductArgs = {
  name: Scalars['String'];
  description: Scalars['String'];
  type: Scalars['String'];
  averageRating?: InputMaybe<Scalars['Int']>;
  quantity: Scalars['Int'];
  price: Scalars['Float'];
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


/** All mutations */
export type MutationupdateProductArgs = {
  _id: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  averageRating?: InputMaybe<Scalars['Int']>;
  quantity?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Float']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


/** All mutations */
export type MutationdeleteProductArgs = {
  _id: Scalars['String'];
};

  export type QuerySdk = {
      /** A single product **/
  product: InContextSdkMethod<Query['product'], QueryproductArgs, MeshContext>,
  /** List all products **/
  products: InContextSdkMethod<Query['products'], {}, MeshContext>
  };

  export type MutationSdk = {
      /** add product **/
  addProduct: InContextSdkMethod<Mutation['addProduct'], MutationaddProductArgs, MeshContext>,
  /** update product **/
  updateProduct: InContextSdkMethod<Mutation['updateProduct'], MutationupdateProductArgs, MeshContext>,
  /** delete product **/
  deleteProduct: InContextSdkMethod<Mutation['deleteProduct'], MutationdeleteProductArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Products"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
