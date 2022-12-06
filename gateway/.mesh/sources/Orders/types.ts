// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace OrdersTypes {
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
  /** List all orders */
  orders?: Maybe<Array<Maybe<Order>>>;
  /** A single order */
  order?: Maybe<Order>;
  /** Get orders by user */
  orderByUser?: Maybe<Array<Maybe<Order>>>;
  /** Get orders by product */
  orderByProduct?: Maybe<Array<Maybe<Order>>>;
};


/** All queries */
export type QueryorderArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


/** All queries */
export type QueryorderByUserArgs = {
  userid?: InputMaybe<Scalars['String']>;
};


/** All queries */
export type QueryorderByProductArgs = {
  productid?: InputMaybe<Scalars['String']>;
};

/** This represents an order */
export type Order = {
  userid?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Maybe<productOrder>>>;
  total?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  orderid?: Maybe<Scalars['String']>;
};

/** This represents a product saved in order */
export type productOrder = {
  productid?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
};

/** All mutations */
export type Mutation = {
  /** create order */
  createOrder?: Maybe<Order>;
  /** update order status */
  updateOrderStatus?: Maybe<Order>;
  /** Start order with camunda */
  startOrder?: Maybe<returnMessage>;
};


/** All mutations */
export type MutationcreateOrderArgs = {
  userid: Scalars['String'];
  products?: InputMaybe<Array<productOrderInput>>;
  total: Scalars['Int'];
  status: Scalars['String'];
  orderid?: InputMaybe<Scalars['String']>;
};


/** All mutations */
export type MutationupdateOrderStatusArgs = {
  _id: Scalars['String'];
  status: Scalars['String'];
};


/** All mutations */
export type MutationstartOrderArgs = {
  userid?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<OrderInput>;
  ptype?: InputMaybe<Scalars['String']>;
  orderid?: InputMaybe<Scalars['String']>;
};

/** This represents a product input */
export type productOrderInput = {
  productid?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

/** this represents a return message */
export type returnMessage = {
  message?: Maybe<Scalars['String']>;
};

/** This represents an order input for camunda */
export type OrderInput = {
  userid?: InputMaybe<Scalars['String']>;
  products?: InputMaybe<Array<InputMaybe<productOrderInput>>>;
  orderid?: InputMaybe<Scalars['String']>;
};

  export type QuerySdk = {
      /** List all orders **/
  orders: InContextSdkMethod<Query['orders'], {}, MeshContext>,
  /** A single order **/
  order: InContextSdkMethod<Query['order'], QueryorderArgs, MeshContext>,
  /** Get orders by user **/
  orderByUser: InContextSdkMethod<Query['orderByUser'], QueryorderByUserArgs, MeshContext>,
  /** Get orders by product **/
  orderByProduct: InContextSdkMethod<Query['orderByProduct'], QueryorderByProductArgs, MeshContext>
  };

  export type MutationSdk = {
      /** create order **/
  createOrder: InContextSdkMethod<Mutation['createOrder'], MutationcreateOrderArgs, MeshContext>,
  /** update order status **/
  updateOrderStatus: InContextSdkMethod<Mutation['updateOrderStatus'], MutationupdateOrderStatusArgs, MeshContext>,
  /** Start order with camunda **/
  startOrder: InContextSdkMethod<Mutation['startOrder'], MutationstartOrderArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Orders"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
