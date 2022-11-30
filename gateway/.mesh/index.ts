// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode } from 'graphql';
import { findAndParseConfig } from '@graphql-mesh/cli';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { ProductsTypes } from './sources/Products/types';
import type { OrdersTypes } from './sources/Orders/types';
import type { UsersTypes } from './sources/Users/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



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
  /** A single product */
  product?: Maybe<Product>;
  /** List all products */
  products?: Maybe<Array<Maybe<Product>>>;
  /** A single user */
  user?: Maybe<User>;
  /** List all users */
  users?: Maybe<Array<Maybe<User>>>;
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


/** All queries */
export type QueryproductArgs = {
  id?: InputMaybe<Scalars['String']>;
};


/** All queries */
export type QueryuserArgs = {
  _id?: InputMaybe<Scalars['String']>;
};

/** All mutations */
export type Mutation = {
  /** create order */
  createOrder?: Maybe<Order>;
  /** update order status */
  updateOrderStatus?: Maybe<Order>;
  /** Start order with camunda */
  startOrder?: Maybe<Scalars['String']>;
  /** add product */
  addProduct?: Maybe<Product>;
  /** update product */
  updateProduct?: Maybe<Product>;
  /** delete product */
  deleteProduct?: Maybe<Product>;
  /** register user */
  register?: Maybe<jwttoken>;
  /** login user */
  login?: Maybe<jwttoken>;
};


/** All mutations */
export type MutationcreateOrderArgs = {
  userid: Scalars['String'];
  products?: InputMaybe<Array<productOrderInput>>;
  total: Scalars['Int'];
  status: Scalars['String'];
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

/** This represents an order */
export type Order = {
  userid?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Maybe<productOrder>>>;
  total?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['String']>;
  userDetails: User;
};

/** This represents a product saved in order */
export type productOrder = {
  productid?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  productDetails: Product;
};

/** This represents a product input */
export type productOrderInput = {
  productid?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

/** This represents an order input for camunda */
export type OrderInput = {
  userid?: InputMaybe<Scalars['String']>;
  products?: InputMaybe<Array<InputMaybe<productOrderInput>>>;
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
  orderList: Array<Order>;
};

/** This represents a product image */
export type images = {
  url?: Maybe<Scalars['String']>;
};

/** This represents a user */
export type User = {
  _id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  orders: Array<Order>;
};

/** This represents a jwt token */
export type jwttoken = {
  token: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  String: ResolverTypeWrapper<Scalars['String']>;
  productOrder: ResolverTypeWrapper<productOrder>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  productOrderInput: productOrderInput;
  OrderInput: OrderInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Product: ResolverTypeWrapper<Product>;
  images: ResolverTypeWrapper<images>;
  User: ResolverTypeWrapper<User>;
  jwttoken: ResolverTypeWrapper<jwttoken>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  Order: Order;
  String: Scalars['String'];
  productOrder: productOrder;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  productOrderInput: productOrderInput;
  OrderInput: OrderInput;
  Boolean: Scalars['Boolean'];
  Product: Product;
  images: images;
  User: User;
  jwttoken: jwttoken;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  orders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Order']>>>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, Partial<QueryorderArgs>>;
  orderByUser?: Resolver<Maybe<Array<Maybe<ResolversTypes['Order']>>>, ParentType, ContextType, Partial<QueryorderByUserArgs>>;
  orderByProduct?: Resolver<Maybe<Array<Maybe<ResolversTypes['Order']>>>, ParentType, ContextType, Partial<QueryorderByProductArgs>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, Partial<QueryproductArgs>>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryuserArgs>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationcreateOrderArgs, 'userid' | 'total' | 'status'>>;
  updateOrderStatus?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationupdateOrderStatusArgs, '_id' | 'status'>>;
  startOrder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<MutationstartOrderArgs>>;
  addProduct?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationaddProductArgs, 'name' | 'description' | 'type' | 'quantity' | 'price'>>;
  updateProduct?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationupdateProductArgs, '_id'>>;
  deleteProduct?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationdeleteProductArgs, '_id'>>;
  register?: Resolver<Maybe<ResolversTypes['jwttoken']>, ParentType, ContextType, RequireFields<MutationregisterArgs, 'name' | 'email' | 'password'>>;
  login?: Resolver<Maybe<ResolversTypes['jwttoken']>, ParentType, ContextType, RequireFields<MutationloginArgs, 'email' | 'password'>>;
}>;

export type OrderResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  userid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<Maybe<ResolversTypes['productOrder']>>>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userDetails?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type productOrderResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['productOrder'] = ResolversParentTypes['productOrder']> = ResolversObject<{
  productid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  productDetails?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  averageRating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<Maybe<ResolversTypes['images']>>>, ParentType, ContextType>;
  orderList?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type imagesResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['images'] = ResolversParentTypes['images']> = ResolversObject<{
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type jwttokenResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['jwttoken'] = ResolversParentTypes['jwttoken']> = ResolversObject<{
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  productOrder?: productOrderResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  images?: imagesResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  jwttoken?: jwttokenResolvers<ContextType>;
}>;


export type MeshContext = OrdersTypes.Context & ProductsTypes.Context & UsersTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export function getMeshOptions() {
  console.warn('WARNING: These artifacts are built for development mode. Please run "mesh build" to build production artifacts');
  return findAndParseConfig({
    dir: baseDir,
    artifactsDir: ".mesh",
    configName: "mesh",
    additionalPackagePrefixes: [],
    initialLoggerPrefix: "🕸️  Mesh",
  });
}

export function createBuiltMeshHTTPHandler(): MeshHTTPHandler<MeshContext> {
  return createMeshHTTPHandler<MeshContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: {"hostname":"0.0.0.0"},
  })
}

let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltMesh(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args));