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
};


/** All queries */
export type QueryuserArgs = {
  _id?: InputMaybe<Scalars['String']>;
};

/** This represents a user */
export type User = {
  name?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

  export type QuerySdk = {
      /** A single user **/
  user: InContextSdkMethod<Query['user'], QueryuserArgs, MeshContext>,
  /** List all users **/
  users: InContextSdkMethod<Query['users'], {}, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["Users"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
