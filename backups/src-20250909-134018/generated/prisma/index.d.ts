
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model OnboardingSession
 * 
 */
export type OnboardingSession = $Result.DefaultSelection<Prisma.$OnboardingSessionPayload>
/**
 * Model OnboardingSection
 * 
 */
export type OnboardingSection = $Result.DefaultSelection<Prisma.$OnboardingSectionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more OnboardingSessions
 * const onboardingSessions = await prisma.onboardingSession.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more OnboardingSessions
   * const onboardingSessions = await prisma.onboardingSession.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.onboardingSession`: Exposes CRUD operations for the **OnboardingSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OnboardingSessions
    * const onboardingSessions = await prisma.onboardingSession.findMany()
    * ```
    */
  get onboardingSession(): Prisma.OnboardingSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.onboardingSection`: Exposes CRUD operations for the **OnboardingSection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OnboardingSections
    * const onboardingSections = await prisma.onboardingSection.findMany()
    * ```
    */
  get onboardingSection(): Prisma.OnboardingSectionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    OnboardingSession: 'OnboardingSession',
    OnboardingSection: 'OnboardingSection'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "onboardingSession" | "onboardingSection"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      OnboardingSession: {
        payload: Prisma.$OnboardingSessionPayload<ExtArgs>
        fields: Prisma.OnboardingSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OnboardingSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OnboardingSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>
          }
          findFirst: {
            args: Prisma.OnboardingSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OnboardingSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>
          }
          findMany: {
            args: Prisma.OnboardingSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>[]
          }
          create: {
            args: Prisma.OnboardingSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>
          }
          createMany: {
            args: Prisma.OnboardingSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OnboardingSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>[]
          }
          delete: {
            args: Prisma.OnboardingSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>
          }
          update: {
            args: Prisma.OnboardingSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>
          }
          deleteMany: {
            args: Prisma.OnboardingSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OnboardingSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OnboardingSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>[]
          }
          upsert: {
            args: Prisma.OnboardingSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSessionPayload>
          }
          aggregate: {
            args: Prisma.OnboardingSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOnboardingSession>
          }
          groupBy: {
            args: Prisma.OnboardingSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OnboardingSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OnboardingSessionCountArgs<ExtArgs>
            result: $Utils.Optional<OnboardingSessionCountAggregateOutputType> | number
          }
        }
      }
      OnboardingSection: {
        payload: Prisma.$OnboardingSectionPayload<ExtArgs>
        fields: Prisma.OnboardingSectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OnboardingSectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OnboardingSectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>
          }
          findFirst: {
            args: Prisma.OnboardingSectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OnboardingSectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>
          }
          findMany: {
            args: Prisma.OnboardingSectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>[]
          }
          create: {
            args: Prisma.OnboardingSectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>
          }
          createMany: {
            args: Prisma.OnboardingSectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OnboardingSectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>[]
          }
          delete: {
            args: Prisma.OnboardingSectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>
          }
          update: {
            args: Prisma.OnboardingSectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>
          }
          deleteMany: {
            args: Prisma.OnboardingSectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OnboardingSectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OnboardingSectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>[]
          }
          upsert: {
            args: Prisma.OnboardingSectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OnboardingSectionPayload>
          }
          aggregate: {
            args: Prisma.OnboardingSectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOnboardingSection>
          }
          groupBy: {
            args: Prisma.OnboardingSectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OnboardingSectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OnboardingSectionCountArgs<ExtArgs>
            result: $Utils.Optional<OnboardingSectionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    onboardingSession?: OnboardingSessionOmit
    onboardingSection?: OnboardingSectionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OnboardingSessionCountOutputType
   */

  export type OnboardingSessionCountOutputType = {
    sections: number
  }

  export type OnboardingSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | OnboardingSessionCountOutputTypeCountSectionsArgs
  }

  // Custom InputTypes
  /**
   * OnboardingSessionCountOutputType without action
   */
  export type OnboardingSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSessionCountOutputType
     */
    select?: OnboardingSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OnboardingSessionCountOutputType without action
   */
  export type OnboardingSessionCountOutputTypeCountSectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OnboardingSectionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model OnboardingSession
   */

  export type AggregateOnboardingSession = {
    _count: OnboardingSessionCountAggregateOutputType | null
    _min: OnboardingSessionMinAggregateOutputType | null
    _max: OnboardingSessionMaxAggregateOutputType | null
  }

  export type OnboardingSessionMinAggregateOutputType = {
    id: string | null
    token: string | null
    status: string | null
    lastActivity: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OnboardingSessionMaxAggregateOutputType = {
    id: string | null
    token: string | null
    status: string | null
    lastActivity: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OnboardingSessionCountAggregateOutputType = {
    id: number
    token: number
    status: number
    lastActivity: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OnboardingSessionMinAggregateInputType = {
    id?: true
    token?: true
    status?: true
    lastActivity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OnboardingSessionMaxAggregateInputType = {
    id?: true
    token?: true
    status?: true
    lastActivity?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OnboardingSessionCountAggregateInputType = {
    id?: true
    token?: true
    status?: true
    lastActivity?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OnboardingSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OnboardingSession to aggregate.
     */
    where?: OnboardingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSessions to fetch.
     */
    orderBy?: OnboardingSessionOrderByWithRelationInput | OnboardingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OnboardingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OnboardingSessions
    **/
    _count?: true | OnboardingSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OnboardingSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OnboardingSessionMaxAggregateInputType
  }

  export type GetOnboardingSessionAggregateType<T extends OnboardingSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateOnboardingSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOnboardingSession[P]>
      : GetScalarType<T[P], AggregateOnboardingSession[P]>
  }




  export type OnboardingSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OnboardingSessionWhereInput
    orderBy?: OnboardingSessionOrderByWithAggregationInput | OnboardingSessionOrderByWithAggregationInput[]
    by: OnboardingSessionScalarFieldEnum[] | OnboardingSessionScalarFieldEnum
    having?: OnboardingSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OnboardingSessionCountAggregateInputType | true
    _min?: OnboardingSessionMinAggregateInputType
    _max?: OnboardingSessionMaxAggregateInputType
  }

  export type OnboardingSessionGroupByOutputType = {
    id: string
    token: string
    status: string
    lastActivity: Date
    createdAt: Date
    updatedAt: Date
    _count: OnboardingSessionCountAggregateOutputType | null
    _min: OnboardingSessionMinAggregateOutputType | null
    _max: OnboardingSessionMaxAggregateOutputType | null
  }

  type GetOnboardingSessionGroupByPayload<T extends OnboardingSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OnboardingSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OnboardingSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OnboardingSessionGroupByOutputType[P]>
            : GetScalarType<T[P], OnboardingSessionGroupByOutputType[P]>
        }
      >
    >


  export type OnboardingSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    status?: boolean
    lastActivity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sections?: boolean | OnboardingSession$sectionsArgs<ExtArgs>
    _count?: boolean | OnboardingSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["onboardingSession"]>

  export type OnboardingSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    status?: boolean
    lastActivity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["onboardingSession"]>

  export type OnboardingSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    status?: boolean
    lastActivity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["onboardingSession"]>

  export type OnboardingSessionSelectScalar = {
    id?: boolean
    token?: boolean
    status?: boolean
    lastActivity?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OnboardingSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "token" | "status" | "lastActivity" | "createdAt" | "updatedAt", ExtArgs["result"]["onboardingSession"]>
  export type OnboardingSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | OnboardingSession$sectionsArgs<ExtArgs>
    _count?: boolean | OnboardingSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OnboardingSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OnboardingSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OnboardingSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OnboardingSession"
    objects: {
      sections: Prisma.$OnboardingSectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      status: string
      lastActivity: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["onboardingSession"]>
    composites: {}
  }

  type OnboardingSessionGetPayload<S extends boolean | null | undefined | OnboardingSessionDefaultArgs> = $Result.GetResult<Prisma.$OnboardingSessionPayload, S>

  type OnboardingSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OnboardingSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OnboardingSessionCountAggregateInputType | true
    }

  export interface OnboardingSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OnboardingSession'], meta: { name: 'OnboardingSession' } }
    /**
     * Find zero or one OnboardingSession that matches the filter.
     * @param {OnboardingSessionFindUniqueArgs} args - Arguments to find a OnboardingSession
     * @example
     * // Get one OnboardingSession
     * const onboardingSession = await prisma.onboardingSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OnboardingSessionFindUniqueArgs>(args: SelectSubset<T, OnboardingSessionFindUniqueArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OnboardingSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OnboardingSessionFindUniqueOrThrowArgs} args - Arguments to find a OnboardingSession
     * @example
     * // Get one OnboardingSession
     * const onboardingSession = await prisma.onboardingSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OnboardingSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, OnboardingSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OnboardingSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSessionFindFirstArgs} args - Arguments to find a OnboardingSession
     * @example
     * // Get one OnboardingSession
     * const onboardingSession = await prisma.onboardingSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OnboardingSessionFindFirstArgs>(args?: SelectSubset<T, OnboardingSessionFindFirstArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OnboardingSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSessionFindFirstOrThrowArgs} args - Arguments to find a OnboardingSession
     * @example
     * // Get one OnboardingSession
     * const onboardingSession = await prisma.onboardingSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OnboardingSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, OnboardingSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OnboardingSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OnboardingSessions
     * const onboardingSessions = await prisma.onboardingSession.findMany()
     * 
     * // Get first 10 OnboardingSessions
     * const onboardingSessions = await prisma.onboardingSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const onboardingSessionWithIdOnly = await prisma.onboardingSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OnboardingSessionFindManyArgs>(args?: SelectSubset<T, OnboardingSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OnboardingSession.
     * @param {OnboardingSessionCreateArgs} args - Arguments to create a OnboardingSession.
     * @example
     * // Create one OnboardingSession
     * const OnboardingSession = await prisma.onboardingSession.create({
     *   data: {
     *     // ... data to create a OnboardingSession
     *   }
     * })
     * 
     */
    create<T extends OnboardingSessionCreateArgs>(args: SelectSubset<T, OnboardingSessionCreateArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OnboardingSessions.
     * @param {OnboardingSessionCreateManyArgs} args - Arguments to create many OnboardingSessions.
     * @example
     * // Create many OnboardingSessions
     * const onboardingSession = await prisma.onboardingSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OnboardingSessionCreateManyArgs>(args?: SelectSubset<T, OnboardingSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OnboardingSessions and returns the data saved in the database.
     * @param {OnboardingSessionCreateManyAndReturnArgs} args - Arguments to create many OnboardingSessions.
     * @example
     * // Create many OnboardingSessions
     * const onboardingSession = await prisma.onboardingSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OnboardingSessions and only return the `id`
     * const onboardingSessionWithIdOnly = await prisma.onboardingSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OnboardingSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, OnboardingSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OnboardingSession.
     * @param {OnboardingSessionDeleteArgs} args - Arguments to delete one OnboardingSession.
     * @example
     * // Delete one OnboardingSession
     * const OnboardingSession = await prisma.onboardingSession.delete({
     *   where: {
     *     // ... filter to delete one OnboardingSession
     *   }
     * })
     * 
     */
    delete<T extends OnboardingSessionDeleteArgs>(args: SelectSubset<T, OnboardingSessionDeleteArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OnboardingSession.
     * @param {OnboardingSessionUpdateArgs} args - Arguments to update one OnboardingSession.
     * @example
     * // Update one OnboardingSession
     * const onboardingSession = await prisma.onboardingSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OnboardingSessionUpdateArgs>(args: SelectSubset<T, OnboardingSessionUpdateArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OnboardingSessions.
     * @param {OnboardingSessionDeleteManyArgs} args - Arguments to filter OnboardingSessions to delete.
     * @example
     * // Delete a few OnboardingSessions
     * const { count } = await prisma.onboardingSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OnboardingSessionDeleteManyArgs>(args?: SelectSubset<T, OnboardingSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OnboardingSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OnboardingSessions
     * const onboardingSession = await prisma.onboardingSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OnboardingSessionUpdateManyArgs>(args: SelectSubset<T, OnboardingSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OnboardingSessions and returns the data updated in the database.
     * @param {OnboardingSessionUpdateManyAndReturnArgs} args - Arguments to update many OnboardingSessions.
     * @example
     * // Update many OnboardingSessions
     * const onboardingSession = await prisma.onboardingSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OnboardingSessions and only return the `id`
     * const onboardingSessionWithIdOnly = await prisma.onboardingSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OnboardingSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, OnboardingSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OnboardingSession.
     * @param {OnboardingSessionUpsertArgs} args - Arguments to update or create a OnboardingSession.
     * @example
     * // Update or create a OnboardingSession
     * const onboardingSession = await prisma.onboardingSession.upsert({
     *   create: {
     *     // ... data to create a OnboardingSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OnboardingSession we want to update
     *   }
     * })
     */
    upsert<T extends OnboardingSessionUpsertArgs>(args: SelectSubset<T, OnboardingSessionUpsertArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OnboardingSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSessionCountArgs} args - Arguments to filter OnboardingSessions to count.
     * @example
     * // Count the number of OnboardingSessions
     * const count = await prisma.onboardingSession.count({
     *   where: {
     *     // ... the filter for the OnboardingSessions we want to count
     *   }
     * })
    **/
    count<T extends OnboardingSessionCountArgs>(
      args?: Subset<T, OnboardingSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OnboardingSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OnboardingSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OnboardingSessionAggregateArgs>(args: Subset<T, OnboardingSessionAggregateArgs>): Prisma.PrismaPromise<GetOnboardingSessionAggregateType<T>>

    /**
     * Group by OnboardingSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OnboardingSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OnboardingSessionGroupByArgs['orderBy'] }
        : { orderBy?: OnboardingSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OnboardingSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOnboardingSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OnboardingSession model
   */
  readonly fields: OnboardingSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OnboardingSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OnboardingSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sections<T extends OnboardingSession$sectionsArgs<ExtArgs> = {}>(args?: Subset<T, OnboardingSession$sectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OnboardingSession model
   */
  interface OnboardingSessionFieldRefs {
    readonly id: FieldRef<"OnboardingSession", 'String'>
    readonly token: FieldRef<"OnboardingSession", 'String'>
    readonly status: FieldRef<"OnboardingSession", 'String'>
    readonly lastActivity: FieldRef<"OnboardingSession", 'DateTime'>
    readonly createdAt: FieldRef<"OnboardingSession", 'DateTime'>
    readonly updatedAt: FieldRef<"OnboardingSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OnboardingSession findUnique
   */
  export type OnboardingSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSession to fetch.
     */
    where: OnboardingSessionWhereUniqueInput
  }

  /**
   * OnboardingSession findUniqueOrThrow
   */
  export type OnboardingSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSession to fetch.
     */
    where: OnboardingSessionWhereUniqueInput
  }

  /**
   * OnboardingSession findFirst
   */
  export type OnboardingSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSession to fetch.
     */
    where?: OnboardingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSessions to fetch.
     */
    orderBy?: OnboardingSessionOrderByWithRelationInput | OnboardingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OnboardingSessions.
     */
    cursor?: OnboardingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OnboardingSessions.
     */
    distinct?: OnboardingSessionScalarFieldEnum | OnboardingSessionScalarFieldEnum[]
  }

  /**
   * OnboardingSession findFirstOrThrow
   */
  export type OnboardingSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSession to fetch.
     */
    where?: OnboardingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSessions to fetch.
     */
    orderBy?: OnboardingSessionOrderByWithRelationInput | OnboardingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OnboardingSessions.
     */
    cursor?: OnboardingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OnboardingSessions.
     */
    distinct?: OnboardingSessionScalarFieldEnum | OnboardingSessionScalarFieldEnum[]
  }

  /**
   * OnboardingSession findMany
   */
  export type OnboardingSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSessions to fetch.
     */
    where?: OnboardingSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSessions to fetch.
     */
    orderBy?: OnboardingSessionOrderByWithRelationInput | OnboardingSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OnboardingSessions.
     */
    cursor?: OnboardingSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSessions.
     */
    skip?: number
    distinct?: OnboardingSessionScalarFieldEnum | OnboardingSessionScalarFieldEnum[]
  }

  /**
   * OnboardingSession create
   */
  export type OnboardingSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a OnboardingSession.
     */
    data: XOR<OnboardingSessionCreateInput, OnboardingSessionUncheckedCreateInput>
  }

  /**
   * OnboardingSession createMany
   */
  export type OnboardingSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OnboardingSessions.
     */
    data: OnboardingSessionCreateManyInput | OnboardingSessionCreateManyInput[]
  }

  /**
   * OnboardingSession createManyAndReturn
   */
  export type OnboardingSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * The data used to create many OnboardingSessions.
     */
    data: OnboardingSessionCreateManyInput | OnboardingSessionCreateManyInput[]
  }

  /**
   * OnboardingSession update
   */
  export type OnboardingSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a OnboardingSession.
     */
    data: XOR<OnboardingSessionUpdateInput, OnboardingSessionUncheckedUpdateInput>
    /**
     * Choose, which OnboardingSession to update.
     */
    where: OnboardingSessionWhereUniqueInput
  }

  /**
   * OnboardingSession updateMany
   */
  export type OnboardingSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OnboardingSessions.
     */
    data: XOR<OnboardingSessionUpdateManyMutationInput, OnboardingSessionUncheckedUpdateManyInput>
    /**
     * Filter which OnboardingSessions to update
     */
    where?: OnboardingSessionWhereInput
    /**
     * Limit how many OnboardingSessions to update.
     */
    limit?: number
  }

  /**
   * OnboardingSession updateManyAndReturn
   */
  export type OnboardingSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * The data used to update OnboardingSessions.
     */
    data: XOR<OnboardingSessionUpdateManyMutationInput, OnboardingSessionUncheckedUpdateManyInput>
    /**
     * Filter which OnboardingSessions to update
     */
    where?: OnboardingSessionWhereInput
    /**
     * Limit how many OnboardingSessions to update.
     */
    limit?: number
  }

  /**
   * OnboardingSession upsert
   */
  export type OnboardingSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the OnboardingSession to update in case it exists.
     */
    where: OnboardingSessionWhereUniqueInput
    /**
     * In case the OnboardingSession found by the `where` argument doesn't exist, create a new OnboardingSession with this data.
     */
    create: XOR<OnboardingSessionCreateInput, OnboardingSessionUncheckedCreateInput>
    /**
     * In case the OnboardingSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OnboardingSessionUpdateInput, OnboardingSessionUncheckedUpdateInput>
  }

  /**
   * OnboardingSession delete
   */
  export type OnboardingSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
    /**
     * Filter which OnboardingSession to delete.
     */
    where: OnboardingSessionWhereUniqueInput
  }

  /**
   * OnboardingSession deleteMany
   */
  export type OnboardingSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OnboardingSessions to delete
     */
    where?: OnboardingSessionWhereInput
    /**
     * Limit how many OnboardingSessions to delete.
     */
    limit?: number
  }

  /**
   * OnboardingSession.sections
   */
  export type OnboardingSession$sectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    where?: OnboardingSectionWhereInput
    orderBy?: OnboardingSectionOrderByWithRelationInput | OnboardingSectionOrderByWithRelationInput[]
    cursor?: OnboardingSectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OnboardingSectionScalarFieldEnum | OnboardingSectionScalarFieldEnum[]
  }

  /**
   * OnboardingSession without action
   */
  export type OnboardingSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSession
     */
    select?: OnboardingSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSession
     */
    omit?: OnboardingSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSessionInclude<ExtArgs> | null
  }


  /**
   * Model OnboardingSection
   */

  export type AggregateOnboardingSection = {
    _count: OnboardingSectionCountAggregateOutputType | null
    _min: OnboardingSectionMinAggregateOutputType | null
    _max: OnboardingSectionMaxAggregateOutputType | null
  }

  export type OnboardingSectionMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    name: string | null
    data: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OnboardingSectionMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    name: string | null
    data: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OnboardingSectionCountAggregateOutputType = {
    id: number
    sessionId: number
    name: number
    data: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OnboardingSectionMinAggregateInputType = {
    id?: true
    sessionId?: true
    name?: true
    data?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OnboardingSectionMaxAggregateInputType = {
    id?: true
    sessionId?: true
    name?: true
    data?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OnboardingSectionCountAggregateInputType = {
    id?: true
    sessionId?: true
    name?: true
    data?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OnboardingSectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OnboardingSection to aggregate.
     */
    where?: OnboardingSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSections to fetch.
     */
    orderBy?: OnboardingSectionOrderByWithRelationInput | OnboardingSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OnboardingSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OnboardingSections
    **/
    _count?: true | OnboardingSectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OnboardingSectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OnboardingSectionMaxAggregateInputType
  }

  export type GetOnboardingSectionAggregateType<T extends OnboardingSectionAggregateArgs> = {
        [P in keyof T & keyof AggregateOnboardingSection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOnboardingSection[P]>
      : GetScalarType<T[P], AggregateOnboardingSection[P]>
  }




  export type OnboardingSectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OnboardingSectionWhereInput
    orderBy?: OnboardingSectionOrderByWithAggregationInput | OnboardingSectionOrderByWithAggregationInput[]
    by: OnboardingSectionScalarFieldEnum[] | OnboardingSectionScalarFieldEnum
    having?: OnboardingSectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OnboardingSectionCountAggregateInputType | true
    _min?: OnboardingSectionMinAggregateInputType
    _max?: OnboardingSectionMaxAggregateInputType
  }

  export type OnboardingSectionGroupByOutputType = {
    id: string
    sessionId: string
    name: string
    data: string
    createdAt: Date
    updatedAt: Date
    _count: OnboardingSectionCountAggregateOutputType | null
    _min: OnboardingSectionMinAggregateOutputType | null
    _max: OnboardingSectionMaxAggregateOutputType | null
  }

  type GetOnboardingSectionGroupByPayload<T extends OnboardingSectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OnboardingSectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OnboardingSectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OnboardingSectionGroupByOutputType[P]>
            : GetScalarType<T[P], OnboardingSectionGroupByOutputType[P]>
        }
      >
    >


  export type OnboardingSectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    name?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | OnboardingSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["onboardingSection"]>

  export type OnboardingSectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    name?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | OnboardingSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["onboardingSection"]>

  export type OnboardingSectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    name?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    session?: boolean | OnboardingSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["onboardingSection"]>

  export type OnboardingSectionSelectScalar = {
    id?: boolean
    sessionId?: boolean
    name?: boolean
    data?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OnboardingSectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "name" | "data" | "createdAt" | "updatedAt", ExtArgs["result"]["onboardingSection"]>
  export type OnboardingSectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OnboardingSessionDefaultArgs<ExtArgs>
  }
  export type OnboardingSectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OnboardingSessionDefaultArgs<ExtArgs>
  }
  export type OnboardingSectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | OnboardingSessionDefaultArgs<ExtArgs>
  }

  export type $OnboardingSectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OnboardingSection"
    objects: {
      session: Prisma.$OnboardingSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      name: string
      data: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["onboardingSection"]>
    composites: {}
  }

  type OnboardingSectionGetPayload<S extends boolean | null | undefined | OnboardingSectionDefaultArgs> = $Result.GetResult<Prisma.$OnboardingSectionPayload, S>

  type OnboardingSectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OnboardingSectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OnboardingSectionCountAggregateInputType | true
    }

  export interface OnboardingSectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OnboardingSection'], meta: { name: 'OnboardingSection' } }
    /**
     * Find zero or one OnboardingSection that matches the filter.
     * @param {OnboardingSectionFindUniqueArgs} args - Arguments to find a OnboardingSection
     * @example
     * // Get one OnboardingSection
     * const onboardingSection = await prisma.onboardingSection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OnboardingSectionFindUniqueArgs>(args: SelectSubset<T, OnboardingSectionFindUniqueArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OnboardingSection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OnboardingSectionFindUniqueOrThrowArgs} args - Arguments to find a OnboardingSection
     * @example
     * // Get one OnboardingSection
     * const onboardingSection = await prisma.onboardingSection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OnboardingSectionFindUniqueOrThrowArgs>(args: SelectSubset<T, OnboardingSectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OnboardingSection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSectionFindFirstArgs} args - Arguments to find a OnboardingSection
     * @example
     * // Get one OnboardingSection
     * const onboardingSection = await prisma.onboardingSection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OnboardingSectionFindFirstArgs>(args?: SelectSubset<T, OnboardingSectionFindFirstArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OnboardingSection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSectionFindFirstOrThrowArgs} args - Arguments to find a OnboardingSection
     * @example
     * // Get one OnboardingSection
     * const onboardingSection = await prisma.onboardingSection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OnboardingSectionFindFirstOrThrowArgs>(args?: SelectSubset<T, OnboardingSectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OnboardingSections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OnboardingSections
     * const onboardingSections = await prisma.onboardingSection.findMany()
     * 
     * // Get first 10 OnboardingSections
     * const onboardingSections = await prisma.onboardingSection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const onboardingSectionWithIdOnly = await prisma.onboardingSection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OnboardingSectionFindManyArgs>(args?: SelectSubset<T, OnboardingSectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OnboardingSection.
     * @param {OnboardingSectionCreateArgs} args - Arguments to create a OnboardingSection.
     * @example
     * // Create one OnboardingSection
     * const OnboardingSection = await prisma.onboardingSection.create({
     *   data: {
     *     // ... data to create a OnboardingSection
     *   }
     * })
     * 
     */
    create<T extends OnboardingSectionCreateArgs>(args: SelectSubset<T, OnboardingSectionCreateArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OnboardingSections.
     * @param {OnboardingSectionCreateManyArgs} args - Arguments to create many OnboardingSections.
     * @example
     * // Create many OnboardingSections
     * const onboardingSection = await prisma.onboardingSection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OnboardingSectionCreateManyArgs>(args?: SelectSubset<T, OnboardingSectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OnboardingSections and returns the data saved in the database.
     * @param {OnboardingSectionCreateManyAndReturnArgs} args - Arguments to create many OnboardingSections.
     * @example
     * // Create many OnboardingSections
     * const onboardingSection = await prisma.onboardingSection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OnboardingSections and only return the `id`
     * const onboardingSectionWithIdOnly = await prisma.onboardingSection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OnboardingSectionCreateManyAndReturnArgs>(args?: SelectSubset<T, OnboardingSectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OnboardingSection.
     * @param {OnboardingSectionDeleteArgs} args - Arguments to delete one OnboardingSection.
     * @example
     * // Delete one OnboardingSection
     * const OnboardingSection = await prisma.onboardingSection.delete({
     *   where: {
     *     // ... filter to delete one OnboardingSection
     *   }
     * })
     * 
     */
    delete<T extends OnboardingSectionDeleteArgs>(args: SelectSubset<T, OnboardingSectionDeleteArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OnboardingSection.
     * @param {OnboardingSectionUpdateArgs} args - Arguments to update one OnboardingSection.
     * @example
     * // Update one OnboardingSection
     * const onboardingSection = await prisma.onboardingSection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OnboardingSectionUpdateArgs>(args: SelectSubset<T, OnboardingSectionUpdateArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OnboardingSections.
     * @param {OnboardingSectionDeleteManyArgs} args - Arguments to filter OnboardingSections to delete.
     * @example
     * // Delete a few OnboardingSections
     * const { count } = await prisma.onboardingSection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OnboardingSectionDeleteManyArgs>(args?: SelectSubset<T, OnboardingSectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OnboardingSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OnboardingSections
     * const onboardingSection = await prisma.onboardingSection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OnboardingSectionUpdateManyArgs>(args: SelectSubset<T, OnboardingSectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OnboardingSections and returns the data updated in the database.
     * @param {OnboardingSectionUpdateManyAndReturnArgs} args - Arguments to update many OnboardingSections.
     * @example
     * // Update many OnboardingSections
     * const onboardingSection = await prisma.onboardingSection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OnboardingSections and only return the `id`
     * const onboardingSectionWithIdOnly = await prisma.onboardingSection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OnboardingSectionUpdateManyAndReturnArgs>(args: SelectSubset<T, OnboardingSectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OnboardingSection.
     * @param {OnboardingSectionUpsertArgs} args - Arguments to update or create a OnboardingSection.
     * @example
     * // Update or create a OnboardingSection
     * const onboardingSection = await prisma.onboardingSection.upsert({
     *   create: {
     *     // ... data to create a OnboardingSection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OnboardingSection we want to update
     *   }
     * })
     */
    upsert<T extends OnboardingSectionUpsertArgs>(args: SelectSubset<T, OnboardingSectionUpsertArgs<ExtArgs>>): Prisma__OnboardingSectionClient<$Result.GetResult<Prisma.$OnboardingSectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OnboardingSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSectionCountArgs} args - Arguments to filter OnboardingSections to count.
     * @example
     * // Count the number of OnboardingSections
     * const count = await prisma.onboardingSection.count({
     *   where: {
     *     // ... the filter for the OnboardingSections we want to count
     *   }
     * })
    **/
    count<T extends OnboardingSectionCountArgs>(
      args?: Subset<T, OnboardingSectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OnboardingSectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OnboardingSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OnboardingSectionAggregateArgs>(args: Subset<T, OnboardingSectionAggregateArgs>): Prisma.PrismaPromise<GetOnboardingSectionAggregateType<T>>

    /**
     * Group by OnboardingSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OnboardingSectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OnboardingSectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OnboardingSectionGroupByArgs['orderBy'] }
        : { orderBy?: OnboardingSectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OnboardingSectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOnboardingSectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OnboardingSection model
   */
  readonly fields: OnboardingSectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OnboardingSection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OnboardingSectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends OnboardingSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OnboardingSessionDefaultArgs<ExtArgs>>): Prisma__OnboardingSessionClient<$Result.GetResult<Prisma.$OnboardingSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OnboardingSection model
   */
  interface OnboardingSectionFieldRefs {
    readonly id: FieldRef<"OnboardingSection", 'String'>
    readonly sessionId: FieldRef<"OnboardingSection", 'String'>
    readonly name: FieldRef<"OnboardingSection", 'String'>
    readonly data: FieldRef<"OnboardingSection", 'String'>
    readonly createdAt: FieldRef<"OnboardingSection", 'DateTime'>
    readonly updatedAt: FieldRef<"OnboardingSection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OnboardingSection findUnique
   */
  export type OnboardingSectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSection to fetch.
     */
    where: OnboardingSectionWhereUniqueInput
  }

  /**
   * OnboardingSection findUniqueOrThrow
   */
  export type OnboardingSectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSection to fetch.
     */
    where: OnboardingSectionWhereUniqueInput
  }

  /**
   * OnboardingSection findFirst
   */
  export type OnboardingSectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSection to fetch.
     */
    where?: OnboardingSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSections to fetch.
     */
    orderBy?: OnboardingSectionOrderByWithRelationInput | OnboardingSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OnboardingSections.
     */
    cursor?: OnboardingSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OnboardingSections.
     */
    distinct?: OnboardingSectionScalarFieldEnum | OnboardingSectionScalarFieldEnum[]
  }

  /**
   * OnboardingSection findFirstOrThrow
   */
  export type OnboardingSectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSection to fetch.
     */
    where?: OnboardingSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSections to fetch.
     */
    orderBy?: OnboardingSectionOrderByWithRelationInput | OnboardingSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OnboardingSections.
     */
    cursor?: OnboardingSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OnboardingSections.
     */
    distinct?: OnboardingSectionScalarFieldEnum | OnboardingSectionScalarFieldEnum[]
  }

  /**
   * OnboardingSection findMany
   */
  export type OnboardingSectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * Filter, which OnboardingSections to fetch.
     */
    where?: OnboardingSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OnboardingSections to fetch.
     */
    orderBy?: OnboardingSectionOrderByWithRelationInput | OnboardingSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OnboardingSections.
     */
    cursor?: OnboardingSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OnboardingSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OnboardingSections.
     */
    skip?: number
    distinct?: OnboardingSectionScalarFieldEnum | OnboardingSectionScalarFieldEnum[]
  }

  /**
   * OnboardingSection create
   */
  export type OnboardingSectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * The data needed to create a OnboardingSection.
     */
    data: XOR<OnboardingSectionCreateInput, OnboardingSectionUncheckedCreateInput>
  }

  /**
   * OnboardingSection createMany
   */
  export type OnboardingSectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OnboardingSections.
     */
    data: OnboardingSectionCreateManyInput | OnboardingSectionCreateManyInput[]
  }

  /**
   * OnboardingSection createManyAndReturn
   */
  export type OnboardingSectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * The data used to create many OnboardingSections.
     */
    data: OnboardingSectionCreateManyInput | OnboardingSectionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OnboardingSection update
   */
  export type OnboardingSectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * The data needed to update a OnboardingSection.
     */
    data: XOR<OnboardingSectionUpdateInput, OnboardingSectionUncheckedUpdateInput>
    /**
     * Choose, which OnboardingSection to update.
     */
    where: OnboardingSectionWhereUniqueInput
  }

  /**
   * OnboardingSection updateMany
   */
  export type OnboardingSectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OnboardingSections.
     */
    data: XOR<OnboardingSectionUpdateManyMutationInput, OnboardingSectionUncheckedUpdateManyInput>
    /**
     * Filter which OnboardingSections to update
     */
    where?: OnboardingSectionWhereInput
    /**
     * Limit how many OnboardingSections to update.
     */
    limit?: number
  }

  /**
   * OnboardingSection updateManyAndReturn
   */
  export type OnboardingSectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * The data used to update OnboardingSections.
     */
    data: XOR<OnboardingSectionUpdateManyMutationInput, OnboardingSectionUncheckedUpdateManyInput>
    /**
     * Filter which OnboardingSections to update
     */
    where?: OnboardingSectionWhereInput
    /**
     * Limit how many OnboardingSections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OnboardingSection upsert
   */
  export type OnboardingSectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * The filter to search for the OnboardingSection to update in case it exists.
     */
    where: OnboardingSectionWhereUniqueInput
    /**
     * In case the OnboardingSection found by the `where` argument doesn't exist, create a new OnboardingSection with this data.
     */
    create: XOR<OnboardingSectionCreateInput, OnboardingSectionUncheckedCreateInput>
    /**
     * In case the OnboardingSection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OnboardingSectionUpdateInput, OnboardingSectionUncheckedUpdateInput>
  }

  /**
   * OnboardingSection delete
   */
  export type OnboardingSectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
    /**
     * Filter which OnboardingSection to delete.
     */
    where: OnboardingSectionWhereUniqueInput
  }

  /**
   * OnboardingSection deleteMany
   */
  export type OnboardingSectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OnboardingSections to delete
     */
    where?: OnboardingSectionWhereInput
    /**
     * Limit how many OnboardingSections to delete.
     */
    limit?: number
  }

  /**
   * OnboardingSection without action
   */
  export type OnboardingSectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OnboardingSection
     */
    select?: OnboardingSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OnboardingSection
     */
    omit?: OnboardingSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OnboardingSectionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OnboardingSessionScalarFieldEnum: {
    id: 'id',
    token: 'token',
    status: 'status',
    lastActivity: 'lastActivity',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OnboardingSessionScalarFieldEnum = (typeof OnboardingSessionScalarFieldEnum)[keyof typeof OnboardingSessionScalarFieldEnum]


  export const OnboardingSectionScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    name: 'name',
    data: 'data',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OnboardingSectionScalarFieldEnum = (typeof OnboardingSectionScalarFieldEnum)[keyof typeof OnboardingSectionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type OnboardingSessionWhereInput = {
    AND?: OnboardingSessionWhereInput | OnboardingSessionWhereInput[]
    OR?: OnboardingSessionWhereInput[]
    NOT?: OnboardingSessionWhereInput | OnboardingSessionWhereInput[]
    id?: StringFilter<"OnboardingSession"> | string
    token?: StringFilter<"OnboardingSession"> | string
    status?: StringFilter<"OnboardingSession"> | string
    lastActivity?: DateTimeFilter<"OnboardingSession"> | Date | string
    createdAt?: DateTimeFilter<"OnboardingSession"> | Date | string
    updatedAt?: DateTimeFilter<"OnboardingSession"> | Date | string
    sections?: OnboardingSectionListRelationFilter
  }

  export type OnboardingSessionOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    status?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sections?: OnboardingSectionOrderByRelationAggregateInput
  }

  export type OnboardingSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: OnboardingSessionWhereInput | OnboardingSessionWhereInput[]
    OR?: OnboardingSessionWhereInput[]
    NOT?: OnboardingSessionWhereInput | OnboardingSessionWhereInput[]
    status?: StringFilter<"OnboardingSession"> | string
    lastActivity?: DateTimeFilter<"OnboardingSession"> | Date | string
    createdAt?: DateTimeFilter<"OnboardingSession"> | Date | string
    updatedAt?: DateTimeFilter<"OnboardingSession"> | Date | string
    sections?: OnboardingSectionListRelationFilter
  }, "id" | "token">

  export type OnboardingSessionOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    status?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OnboardingSessionCountOrderByAggregateInput
    _max?: OnboardingSessionMaxOrderByAggregateInput
    _min?: OnboardingSessionMinOrderByAggregateInput
  }

  export type OnboardingSessionScalarWhereWithAggregatesInput = {
    AND?: OnboardingSessionScalarWhereWithAggregatesInput | OnboardingSessionScalarWhereWithAggregatesInput[]
    OR?: OnboardingSessionScalarWhereWithAggregatesInput[]
    NOT?: OnboardingSessionScalarWhereWithAggregatesInput | OnboardingSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OnboardingSession"> | string
    token?: StringWithAggregatesFilter<"OnboardingSession"> | string
    status?: StringWithAggregatesFilter<"OnboardingSession"> | string
    lastActivity?: DateTimeWithAggregatesFilter<"OnboardingSession"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"OnboardingSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OnboardingSession"> | Date | string
  }

  export type OnboardingSectionWhereInput = {
    AND?: OnboardingSectionWhereInput | OnboardingSectionWhereInput[]
    OR?: OnboardingSectionWhereInput[]
    NOT?: OnboardingSectionWhereInput | OnboardingSectionWhereInput[]
    id?: StringFilter<"OnboardingSection"> | string
    sessionId?: StringFilter<"OnboardingSection"> | string
    name?: StringFilter<"OnboardingSection"> | string
    data?: StringFilter<"OnboardingSection"> | string
    createdAt?: DateTimeFilter<"OnboardingSection"> | Date | string
    updatedAt?: DateTimeFilter<"OnboardingSection"> | Date | string
    session?: XOR<OnboardingSessionScalarRelationFilter, OnboardingSessionWhereInput>
  }

  export type OnboardingSectionOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    name?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    session?: OnboardingSessionOrderByWithRelationInput
  }

  export type OnboardingSectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId_name?: OnboardingSectionSessionIdNameCompoundUniqueInput
    AND?: OnboardingSectionWhereInput | OnboardingSectionWhereInput[]
    OR?: OnboardingSectionWhereInput[]
    NOT?: OnboardingSectionWhereInput | OnboardingSectionWhereInput[]
    sessionId?: StringFilter<"OnboardingSection"> | string
    name?: StringFilter<"OnboardingSection"> | string
    data?: StringFilter<"OnboardingSection"> | string
    createdAt?: DateTimeFilter<"OnboardingSection"> | Date | string
    updatedAt?: DateTimeFilter<"OnboardingSection"> | Date | string
    session?: XOR<OnboardingSessionScalarRelationFilter, OnboardingSessionWhereInput>
  }, "id" | "sessionId_name">

  export type OnboardingSectionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    name?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OnboardingSectionCountOrderByAggregateInput
    _max?: OnboardingSectionMaxOrderByAggregateInput
    _min?: OnboardingSectionMinOrderByAggregateInput
  }

  export type OnboardingSectionScalarWhereWithAggregatesInput = {
    AND?: OnboardingSectionScalarWhereWithAggregatesInput | OnboardingSectionScalarWhereWithAggregatesInput[]
    OR?: OnboardingSectionScalarWhereWithAggregatesInput[]
    NOT?: OnboardingSectionScalarWhereWithAggregatesInput | OnboardingSectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OnboardingSection"> | string
    sessionId?: StringWithAggregatesFilter<"OnboardingSection"> | string
    name?: StringWithAggregatesFilter<"OnboardingSection"> | string
    data?: StringWithAggregatesFilter<"OnboardingSection"> | string
    createdAt?: DateTimeWithAggregatesFilter<"OnboardingSection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OnboardingSection"> | Date | string
  }

  export type OnboardingSessionCreateInput = {
    id?: string
    token: string
    status?: string
    lastActivity?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    sections?: OnboardingSectionCreateNestedManyWithoutSessionInput
  }

  export type OnboardingSessionUncheckedCreateInput = {
    id?: string
    token: string
    status?: string
    lastActivity?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    sections?: OnboardingSectionUncheckedCreateNestedManyWithoutSessionInput
  }

  export type OnboardingSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: OnboardingSectionUpdateManyWithoutSessionNestedInput
  }

  export type OnboardingSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: OnboardingSectionUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type OnboardingSessionCreateManyInput = {
    id?: string
    token: string
    status?: string
    lastActivity?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSectionCreateInput = {
    id?: string
    name: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
    session: OnboardingSessionCreateNestedOneWithoutSectionsInput
  }

  export type OnboardingSectionUncheckedCreateInput = {
    id?: string
    sessionId: string
    name: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: OnboardingSessionUpdateOneRequiredWithoutSectionsNestedInput
  }

  export type OnboardingSectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSectionCreateManyInput = {
    id?: string
    sessionId: string
    name: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type OnboardingSectionListRelationFilter = {
    every?: OnboardingSectionWhereInput
    some?: OnboardingSectionWhereInput
    none?: OnboardingSectionWhereInput
  }

  export type OnboardingSectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OnboardingSessionCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    status?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OnboardingSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    status?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OnboardingSessionMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    status?: SortOrder
    lastActivity?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OnboardingSessionScalarRelationFilter = {
    is?: OnboardingSessionWhereInput
    isNot?: OnboardingSessionWhereInput
  }

  export type OnboardingSectionSessionIdNameCompoundUniqueInput = {
    sessionId: string
    name: string
  }

  export type OnboardingSectionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    name?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OnboardingSectionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    name?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OnboardingSectionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    name?: SortOrder
    data?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OnboardingSectionCreateNestedManyWithoutSessionInput = {
    create?: XOR<OnboardingSectionCreateWithoutSessionInput, OnboardingSectionUncheckedCreateWithoutSessionInput> | OnboardingSectionCreateWithoutSessionInput[] | OnboardingSectionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OnboardingSectionCreateOrConnectWithoutSessionInput | OnboardingSectionCreateOrConnectWithoutSessionInput[]
    createMany?: OnboardingSectionCreateManySessionInputEnvelope
    connect?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
  }

  export type OnboardingSectionUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<OnboardingSectionCreateWithoutSessionInput, OnboardingSectionUncheckedCreateWithoutSessionInput> | OnboardingSectionCreateWithoutSessionInput[] | OnboardingSectionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OnboardingSectionCreateOrConnectWithoutSessionInput | OnboardingSectionCreateOrConnectWithoutSessionInput[]
    createMany?: OnboardingSectionCreateManySessionInputEnvelope
    connect?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type OnboardingSectionUpdateManyWithoutSessionNestedInput = {
    create?: XOR<OnboardingSectionCreateWithoutSessionInput, OnboardingSectionUncheckedCreateWithoutSessionInput> | OnboardingSectionCreateWithoutSessionInput[] | OnboardingSectionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OnboardingSectionCreateOrConnectWithoutSessionInput | OnboardingSectionCreateOrConnectWithoutSessionInput[]
    upsert?: OnboardingSectionUpsertWithWhereUniqueWithoutSessionInput | OnboardingSectionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: OnboardingSectionCreateManySessionInputEnvelope
    set?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    disconnect?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    delete?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    connect?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    update?: OnboardingSectionUpdateWithWhereUniqueWithoutSessionInput | OnboardingSectionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: OnboardingSectionUpdateManyWithWhereWithoutSessionInput | OnboardingSectionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: OnboardingSectionScalarWhereInput | OnboardingSectionScalarWhereInput[]
  }

  export type OnboardingSectionUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<OnboardingSectionCreateWithoutSessionInput, OnboardingSectionUncheckedCreateWithoutSessionInput> | OnboardingSectionCreateWithoutSessionInput[] | OnboardingSectionUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: OnboardingSectionCreateOrConnectWithoutSessionInput | OnboardingSectionCreateOrConnectWithoutSessionInput[]
    upsert?: OnboardingSectionUpsertWithWhereUniqueWithoutSessionInput | OnboardingSectionUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: OnboardingSectionCreateManySessionInputEnvelope
    set?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    disconnect?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    delete?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    connect?: OnboardingSectionWhereUniqueInput | OnboardingSectionWhereUniqueInput[]
    update?: OnboardingSectionUpdateWithWhereUniqueWithoutSessionInput | OnboardingSectionUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: OnboardingSectionUpdateManyWithWhereWithoutSessionInput | OnboardingSectionUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: OnboardingSectionScalarWhereInput | OnboardingSectionScalarWhereInput[]
  }

  export type OnboardingSessionCreateNestedOneWithoutSectionsInput = {
    create?: XOR<OnboardingSessionCreateWithoutSectionsInput, OnboardingSessionUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: OnboardingSessionCreateOrConnectWithoutSectionsInput
    connect?: OnboardingSessionWhereUniqueInput
  }

  export type OnboardingSessionUpdateOneRequiredWithoutSectionsNestedInput = {
    create?: XOR<OnboardingSessionCreateWithoutSectionsInput, OnboardingSessionUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: OnboardingSessionCreateOrConnectWithoutSectionsInput
    upsert?: OnboardingSessionUpsertWithoutSectionsInput
    connect?: OnboardingSessionWhereUniqueInput
    update?: XOR<XOR<OnboardingSessionUpdateToOneWithWhereWithoutSectionsInput, OnboardingSessionUpdateWithoutSectionsInput>, OnboardingSessionUncheckedUpdateWithoutSectionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type OnboardingSectionCreateWithoutSessionInput = {
    id?: string
    name: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSectionUncheckedCreateWithoutSessionInput = {
    id?: string
    name: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSectionCreateOrConnectWithoutSessionInput = {
    where: OnboardingSectionWhereUniqueInput
    create: XOR<OnboardingSectionCreateWithoutSessionInput, OnboardingSectionUncheckedCreateWithoutSessionInput>
  }

  export type OnboardingSectionCreateManySessionInputEnvelope = {
    data: OnboardingSectionCreateManySessionInput | OnboardingSectionCreateManySessionInput[]
  }

  export type OnboardingSectionUpsertWithWhereUniqueWithoutSessionInput = {
    where: OnboardingSectionWhereUniqueInput
    update: XOR<OnboardingSectionUpdateWithoutSessionInput, OnboardingSectionUncheckedUpdateWithoutSessionInput>
    create: XOR<OnboardingSectionCreateWithoutSessionInput, OnboardingSectionUncheckedCreateWithoutSessionInput>
  }

  export type OnboardingSectionUpdateWithWhereUniqueWithoutSessionInput = {
    where: OnboardingSectionWhereUniqueInput
    data: XOR<OnboardingSectionUpdateWithoutSessionInput, OnboardingSectionUncheckedUpdateWithoutSessionInput>
  }

  export type OnboardingSectionUpdateManyWithWhereWithoutSessionInput = {
    where: OnboardingSectionScalarWhereInput
    data: XOR<OnboardingSectionUpdateManyMutationInput, OnboardingSectionUncheckedUpdateManyWithoutSessionInput>
  }

  export type OnboardingSectionScalarWhereInput = {
    AND?: OnboardingSectionScalarWhereInput | OnboardingSectionScalarWhereInput[]
    OR?: OnboardingSectionScalarWhereInput[]
    NOT?: OnboardingSectionScalarWhereInput | OnboardingSectionScalarWhereInput[]
    id?: StringFilter<"OnboardingSection"> | string
    sessionId?: StringFilter<"OnboardingSection"> | string
    name?: StringFilter<"OnboardingSection"> | string
    data?: StringFilter<"OnboardingSection"> | string
    createdAt?: DateTimeFilter<"OnboardingSection"> | Date | string
    updatedAt?: DateTimeFilter<"OnboardingSection"> | Date | string
  }

  export type OnboardingSessionCreateWithoutSectionsInput = {
    id?: string
    token: string
    status?: string
    lastActivity?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSessionUncheckedCreateWithoutSectionsInput = {
    id?: string
    token: string
    status?: string
    lastActivity?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSessionCreateOrConnectWithoutSectionsInput = {
    where: OnboardingSessionWhereUniqueInput
    create: XOR<OnboardingSessionCreateWithoutSectionsInput, OnboardingSessionUncheckedCreateWithoutSectionsInput>
  }

  export type OnboardingSessionUpsertWithoutSectionsInput = {
    update: XOR<OnboardingSessionUpdateWithoutSectionsInput, OnboardingSessionUncheckedUpdateWithoutSectionsInput>
    create: XOR<OnboardingSessionCreateWithoutSectionsInput, OnboardingSessionUncheckedCreateWithoutSectionsInput>
    where?: OnboardingSessionWhereInput
  }

  export type OnboardingSessionUpdateToOneWithWhereWithoutSectionsInput = {
    where?: OnboardingSessionWhereInput
    data: XOR<OnboardingSessionUpdateWithoutSectionsInput, OnboardingSessionUncheckedUpdateWithoutSectionsInput>
  }

  export type OnboardingSessionUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSessionUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSectionCreateManySessionInput = {
    id?: string
    name: string
    data: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OnboardingSectionUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSectionUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OnboardingSectionUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    data?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}