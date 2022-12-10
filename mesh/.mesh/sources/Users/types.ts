// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace UsersTypes {
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
  /** A single user */
  user?: Maybe<User>;
  /** List all users */
  users?: Maybe<Array<Maybe<User>>>;
  /** Query logs */
  queryLogs?: Maybe<Array<Maybe<logs>>>;
};


/** All queries */
export type QueryuserArgs = {
  _id?: InputMaybe<Scalars['String']>;
};

/** This represents a user */
export type User = {
  _id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  points?: Maybe<Scalars['Int']>;
};

/** This represents a log */
export type logs = {
  message?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['String']>;
};

/** All mutations */
export type Mutation = {
  /** register user */
  register?: Maybe<jwttoken>;
  /** login user */
  login?: Maybe<jwttoken>;
};


/** All mutations */
export type MutationregisterArgs = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


/** All mutations */
export type MutationloginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

/** This represents a jwt token */
export type jwttoken = {
  token: Scalars['String'];
};

  export type QuerySdk = {
      /** A single user **/
  user: InContextSdkMethod<Query['user'], QueryuserArgs, MeshContext>,
  /** List all users **/
  users: InContextSdkMethod<Query['users'], {}, MeshContext>,
  /** Query logs **/
  queryLogs: InContextSdkMethod<Query['queryLogs'], {}, MeshContext>
  };

  export type MutationSdk = {
      /** register user **/
  register: InContextSdkMethod<Mutation['register'], MutationregisterArgs, MeshContext>,
  /** login user **/
  login: InContextSdkMethod<Mutation['login'], MutationloginArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Users"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
