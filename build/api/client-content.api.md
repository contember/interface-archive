## API Report File for "@contember/client-content"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { GraphQlClientRequestOptions } from '@contember/graphql-client';
import { GraphQlFieldTypedArgs } from '@contember/graphql-builder';
import { GraphQlSelectionSet } from '@contember/graphql-builder';
import { Input } from '@contember/schema';
import { JSONObject } from '@contember/schema';
import { Result } from '@contember/schema';

// @public (undocumented)
export class ContentClient {
    constructor(executor: QueryExecutor);
    // (undocumented)
    mutate<Value>(mutation: ContentMutation<Value>, options?: QueryExecutorOptions): Promise<Value>;
    // (undocumented)
    mutate<Value>(mutations: ContentMutation<Value>[], options?: QueryExecutorOptions): Promise<Value[]>;
    // (undocumented)
    mutate<Values extends Record<string, any>>(mutations: {
        [K in keyof Values]: ContentMutation<Values[K]> | ContentQuery<Values[K]>;
    }, options?: QueryExecutorOptions): Promise<Values>;
    // (undocumented)
    query<Value>(query: ContentQuery<Value>, options?: QueryExecutorOptions): Promise<Value>;
    // (undocumented)
    query<Values extends Record<string, any>>(queries: {
        [K in keyof Values]: ContentQuery<Values[K]>;
    }, options?: QueryExecutorOptions): Promise<Values>;
}

// @public (undocumented)
export namespace ContentClientInput {
    // (undocumented)
    export type AnyListQueryInput = Omit<Input.ListQueryInput, 'orderBy'> & {
        readonly orderBy?: AnyOrderBy;
    };
    // (undocumented)
    export type AnyOrderBy = Input.OrderBy<`${Input.OrderDirection}`>[];
    // (undocumented)
    export type ConnectOrCreateInput<TEntity extends EntityTypeLike> = {
        readonly connect: UniqueWhere<TEntity>;
        readonly create: CreateDataInput<TEntity>;
    };
    // (undocumented)
    export type ConnectOrCreateRelationInput<TEntity extends EntityTypeLike> = {
        readonly connectOrCreate: ConnectOrCreateInput<TEntity>;
    };
    // (undocumented)
    export type ConnectRelationInput<TEntity extends EntityTypeLike> = {
        readonly connect: UniqueWhere<TEntity>;
    };
    // (undocumented)
    export type CreateDataInput<TEntity extends EntityTypeLike> = {
        readonly [key in keyof TEntity['columns']]?: TEntity['columns'][key]['tsType'];
    } & {
        readonly [key in keyof TEntity['hasMany']]?: CreateManyRelationInput<TEntity['hasMany'][key]>;
    } & {
        readonly [key in keyof TEntity['hasOne']]?: CreateOneRelationInput<TEntity['hasOne'][key]>;
    };
    // (undocumented)
    export type CreateInput<TEntity extends EntityTypeLike> = {
        readonly data: CreateDataInput<TEntity>;
    };
    // (undocumented)
    export type CreateManyRelationInput<TEntity extends EntityTypeLike> = readonly CreateOneRelationInput<TEntity>[];
    // (undocumented)
    export type CreateOneRelationInput<TEntity extends EntityTypeLike> = ConnectRelationInput<TEntity> | CreateRelationInput<TEntity> | ConnectOrCreateRelationInput<TEntity>;
    // (undocumented)
    export type CreateRelationInput<TEntity extends EntityTypeLike> = {
        readonly create: CreateDataInput<TEntity>;
    };
    // (undocumented)
    export type DeleteInput<TEntity extends EntityTypeLike> = {
        readonly by: UniqueWhere<TEntity>;
        readonly filter?: Where<TEntity>;
    };
    // (undocumented)
    export type DeleteRelationInput = {
        readonly delete: true;
    };
    // (undocumented)
    export type DeleteSpecifiedRelationInput<TEntity extends EntityTypeLike> = {
        readonly delete: UniqueWhere<TEntity>;
    };
    // (undocumented)
    export type DisconnectRelationInput = {
        readonly disconnect: true;
    };
    // (undocumented)
    export type DisconnectSpecifiedRelationInput<TEntity extends EntityTypeLike> = {
        readonly disconnect: UniqueWhere<TEntity>;
    };
    // (undocumented)
    export type FieldOrderBy<TEntity extends EntityTypeLike> = {
        readonly [key in keyof TEntity['columns']]?: `${Input.OrderDirection}` | null;
    } & {
        readonly [key in keyof TEntity['hasMany']]?: FieldOrderBy<TEntity['hasMany'][key]> | null;
    } & {
        readonly [key in keyof TEntity['hasOne']]?: FieldOrderBy<TEntity['hasOne'][key]> | null;
    };
    // (undocumented)
    export type HasManyByRelationInput<TEntity extends EntityTypeLike, TUnique extends JSONObject> = {
        readonly by: TUnique;
        readonly filter?: Where<TEntity>;
    };
    // (undocumented)
    export type HasManyRelationInput<TEntity extends EntityTypeLike> = ListQueryInput<TEntity>;
    // (undocumented)
    export type HasManyRelationPaginateInput<TEntity extends EntityTypeLike> = PaginationQueryInput<TEntity>;
    // (undocumented)
    export type HasOneRelationInput<TEntity extends EntityTypeLike> = {
        readonly filter?: Where<TEntity>;
    };
    // (undocumented)
    export type ListQueryInput<TEntity extends EntityTypeLike> = {
        readonly filter?: Where<TEntity>;
        readonly orderBy?: readonly OrderBy<TEntity>[];
        readonly offset?: number;
        readonly limit?: number;
    };
    // (undocumented)
    export type OrderBy<TEntity extends EntityTypeLike> = {
        readonly _random?: boolean;
        readonly _randomSeeded?: number;
    } & FieldOrderBy<TEntity>;
    // (undocumented)
    export type PaginationQueryInput<TEntity extends EntityTypeLike> = {
        readonly filter?: Where<TEntity>;
        readonly orderBy?: readonly OrderBy<TEntity>[];
        readonly skip?: number;
        readonly first?: number;
    };
    // (undocumented)
    export type UniqueQueryInput<TEntity extends EntityTypeLike> = {
        readonly by: UniqueWhere<TEntity>;
        readonly filter?: Where<TEntity>;
    };
    // (undocumented)
    export type UniqueWhere<TEntity extends EntityTypeLike> = TEntity['unique'];
    // (undocumented)
    export type UpdateDataInput<TEntity extends EntityTypeLike> = {
        readonly [key in keyof TEntity['columns']]?: TEntity['columns'][key]['tsType'];
    } & {
        readonly [key in keyof TEntity['hasMany']]?: UpdateManyRelationInput<TEntity['hasMany'][key]>;
    } & {
        readonly [key in keyof TEntity['hasOne']]?: UpdateOneRelationInput<TEntity['hasOne'][key]>;
    };
    // (undocumented)
    export type UpdateInput<TEntity extends EntityTypeLike> = {
        readonly by: UniqueWhere<TEntity>;
        readonly filter?: Where<TEntity>;
        readonly data: UpdateDataInput<TEntity>;
    };
    // (undocumented)
    export type UpdateManyRelationInput<TEntity extends EntityTypeLike> = Array<UpdateManyRelationInputItem<TEntity>>;
    // (undocumented)
    export type UpdateManyRelationInputItem<TEntity extends EntityTypeLike> = CreateRelationInput<TEntity> | ConnectRelationInput<TEntity> | ConnectOrCreateRelationInput<TEntity> | DeleteSpecifiedRelationInput<TEntity> | DisconnectSpecifiedRelationInput<TEntity> | UpdateSpecifiedRelationInput<TEntity> | UpsertSpecifiedRelationInput<TEntity>;
    // (undocumented)
    export type UpdateOneRelationInput<TEntity extends EntityTypeLike> = CreateRelationInput<TEntity> | ConnectRelationInput<TEntity> | ConnectOrCreateRelationInput<TEntity> | DeleteRelationInput | DisconnectRelationInput | UpdateRelationInput<TEntity> | UpsertRelationInput<TEntity>;
    // (undocumented)
    export type UpdateRelationInput<TEntity extends EntityTypeLike> = {
        readonly update: UpdateDataInput<TEntity>;
    };
    // (undocumented)
    export type UpdateSpecifiedRelationInput<TEntity extends EntityTypeLike> = {
        readonly update: {
            readonly by: UniqueWhere<TEntity>;
            readonly data: UpdateDataInput<TEntity>;
        };
    };
    // (undocumented)
    export type UpsertInput<TEntity extends EntityTypeLike> = {
        readonly by: UniqueWhere<TEntity>;
        readonly filter?: Where<TEntity>;
        readonly update: UpdateDataInput<TEntity>;
        readonly create: CreateDataInput<TEntity>;
    };
    // (undocumented)
    export type UpsertRelationInput<TEntity extends EntityTypeLike> = {
        readonly upsert: {
            readonly update: UpdateDataInput<TEntity>;
            readonly create: CreateDataInput<TEntity>;
        };
    };
    // (undocumented)
    export type UpsertSpecifiedRelationInput<TEntity extends EntityTypeLike> = {
        readonly upsert: {
            readonly by: UniqueWhere<TEntity>;
            readonly update: UpdateDataInput<TEntity>;
            readonly create: CreateDataInput<TEntity>;
        };
    };
    // (undocumented)
    export type Where<TEntity extends EntityTypeLike> = {
        readonly and?: (readonly (Where<TEntity>)[]) | null;
        readonly or?: (readonly (Where<TEntity>)[]) | null;
        readonly not?: Where<TEntity> | null;
    } & {
        readonly [key in keyof TEntity['columns']]?: Input.Condition<TEntity['columns'][key]> | null;
    } & {
        readonly [key in keyof TEntity['hasMany']]?: Where<TEntity['hasMany'][key]> | null;
    } & {
        readonly [key in keyof TEntity['hasOne']]?: Where<TEntity['hasOne'][key]> | null;
    };
}

// @public (undocumented)
export class ContentEntitySelection {
    // (undocumented)
    $$(): ContentEntitySelection;
    // (undocumented)
    $(field: string, args?: EntitySelectionColumnArgs): ContentEntitySelection;
    // (undocumented)
    $(field: string, args: EntitySelectionManyArgs, selection: ContentEntitySelectionOrCallback): ContentEntitySelection;
    // (undocumented)
    $(field: string, args: EntitySelectionManyByArgs, selection: ContentEntitySelectionOrCallback): ContentEntitySelection;
    // (undocumented)
    $(field: string, args: EntitySelectionOneArgs, selection: ContentEntitySelectionOrCallback): ContentEntitySelection;
    // (undocumented)
    $(field: string, selection: ContentEntitySelectionOrCallback): ContentEntitySelection;
    // @internal
    constructor(
    context: ContentEntitySelectionContext<string>,
    selectionSet: GraphQlSelectionSet);
    // @internal (undocumented)
    readonly context: ContentEntitySelectionContext<string>;
    // @internal (undocumented)
    readonly selectionSet: GraphQlSelectionSet;
}

// @public (undocumented)
export type ContentEntitySelectionCallback = (select: ContentEntitySelection) => ContentEntitySelection;

// @internal (undocumented)
export type ContentEntitySelectionContext<Name extends string> = {
    entity: SchemaEntityNames<Name>;
    schema: SchemaNames;
};

// @public (undocumented)
export type ContentEntitySelectionOrCallback = ContentEntitySelectionCallback | ContentEntitySelection;

// @public (undocumented)
export type ContentMutation<TValue> = ContentOperation<TValue, 'mutation'>;

// @public (undocumented)
export class ContentOperation<TValue, TType extends 'query' | 'mutation'> {
    // @internal
    constructor(
    type: TType,
    fieldName: string,
    args?: GraphQlFieldTypedArgs,
    selection?: GraphQlSelectionSet | undefined,
    parse?: (value: any) => TValue);
    // @internal (undocumented)
    readonly args: GraphQlFieldTypedArgs;
    // @internal (undocumented)
    readonly fieldName: string;
    // @internal (undocumented)
    readonly parse: (value: any) => TValue;
    // @internal (undocumented)
    readonly selection?: GraphQlSelectionSet | undefined;
    // @internal (undocumented)
    readonly type: TType;
}

// @public (undocumented)
export type ContentQuery<TValue> = ContentOperation<TValue, 'query'>;

// @public (undocumented)
export class ContentQueryBuilder {
    constructor(schema: SchemaNames);
    // (undocumented)
    count(name: string, args: Pick<ContentClientInput.AnyListQueryInput, 'filter'>): ContentQuery<number>;
    // (undocumented)
    create(name: string, args: Input.CreateInput, fields?: EntitySelectionOrCallback): ContentMutation<MutationResult>;
    // (undocumented)
    delete(name: string, args: Input.UniqueQueryInput, fields?: EntitySelectionOrCallback): ContentMutation<MutationResult>;
    // (undocumented)
    fragment(name: string, fieldsCallback?: ContentEntitySelectionCallback): ContentEntitySelection;
    // (undocumented)
    get(name: string, args: Input.UniqueQueryInput, fields: EntitySelectionOrCallback): ContentQuery<Record<string, unknown> | null>;
    // (undocumented)
    list(name: string, args: ContentClientInput.AnyListQueryInput, fields: EntitySelectionOrCallback): ContentQuery<any[]>;
    // (undocumented)
    transaction(input: Record<string, ContentMutation<any> | ContentQuery<any>> | ContentMutation<any> | ContentMutation<any>[], options?: MutationTransactionOptions): ContentMutation<TransactionResult<any>>;
    // (undocumented)
    update(name: string, args: Input.UpdateInput, fields?: EntitySelectionOrCallback): ContentMutation<MutationResult>;
    // (undocumented)
    upsert(name: string, args: Input.UpsertInput, fields?: EntitySelectionOrCallback): ContentMutation<MutationResult>;
}

// @public (undocumented)
export type EntitySelectionAnyArgs = EntitySelectionColumnArgs | EntitySelectionManyArgs | EntitySelectionManyByArgs | EntitySelectionOneArgs;

// @public (undocumented)
export type EntitySelectionColumnArgs<Alias extends string | null = string | null> = EntitySelectionCommonInput<Alias>;

// @public (undocumented)
export type EntitySelectionCommonInput<Alias extends string | null = string | null> = {
    as?: Alias;
};

// @public (undocumented)
export type EntitySelectionManyArgs<Alias extends string | null = string | null> = ContentClientInput.AnyListQueryInput & EntitySelectionCommonInput<Alias>;

// @public (undocumented)
export type EntitySelectionManyByArgs<Alias extends string | null = string | null> = {
    by: Input.UniqueWhere;
    filter?: Input.Where;
} & EntitySelectionCommonInput<Alias>;

// @public (undocumented)
export type EntitySelectionOneArgs<Alias extends string | null = string | null> = {
    filter?: Input.Where;
} & EntitySelectionCommonInput<Alias>;

// @public (undocumented)
export type EntitySelectionOrCallback = ContentEntitySelection | ContentEntitySelectionCallback;

// @public (undocumented)
export type EntityTypeLike = {
    name: string;
    unique: JSONObject;
    columns: {
        [columnName: string]: any;
    };
    hasOne: {
        [relationName: string]: EntityTypeLike;
    };
    hasMany: {
        [relationName: string]: EntityTypeLike;
    };
    hasManyBy: {
        [relationName: string]: {
            entity: EntityTypeLike;
            by: JSONObject;
        };
    };
};

// @public (undocumented)
export type FieldPath = {
    readonly field: string;
};

// @public (undocumented)
export type IndexPath = {
    readonly index: number;
    readonly alias: string | null;
};

// @public (undocumented)
export type MutationError = {
    readonly paths: Path[];
    readonly message: string;
    readonly type: Result.ExecutionErrorType;
};

// @public (undocumented)
export type MutationResult<Value = unknown> = {
    readonly ok: boolean;
    readonly errorMessage: string | null;
    readonly errors: MutationError[];
    readonly node: Value | null;
    readonly validation?: ValidationResult;
};

// @public (undocumented)
export type MutationTransactionOptions = {
    deferForeignKeyConstraints?: boolean;
    deferUniqueConstraints?: boolean;
};

// @public (undocumented)
export type Path = Array<FieldPath | IndexPath>;

// @public (undocumented)
export type QueryExecutor = <T = unknown>(query: string, options: GraphQlClientRequestOptions) => Promise<T>;

// @public (undocumented)
export type QueryExecutorOptions = GraphQlClientRequestOptions;

// @public (undocumented)
export type SchemaEntityNames<Name extends string> = {
    readonly name: Name;
    readonly scalars: string[];
    readonly fields: {
        readonly [fieldName: string]: {
            readonly type: 'column';
        } | {
            readonly type: 'many' | 'one';
            readonly entity: string;
        };
    };
};

// @public (undocumented)
export type SchemaNames = {
    entities: {
        [entityName: string]: SchemaEntityNames<string>;
    };
};

// @public (undocumented)
export type SchemaTypeLike = {
    entities: {
        [entityName: string]: EntityTypeLike;
    };
};

// @public (undocumented)
export type TransactionResult<V> = {
    readonly ok: boolean;
    readonly errorMessage: string | null;
    readonly errors: MutationError[];
    readonly validation: ValidationResult;
    readonly data: V;
};

// @public (undocumented)
export type TypedContentEntitySelectionOrCallback<TSchema extends SchemaTypeLike, TEntityName extends keyof TSchema['entities'] & string, TValue> = TypedEntitySelection<TSchema, TEntityName, TSchema['entities'][TEntityName], TValue> | TypedEntitySelectionCallback<TSchema, TEntityName, TSchema['entities'][TEntityName], TValue>;

// @public (undocumented)
export interface TypedContentQueryBuilder<TSchema extends SchemaTypeLike> {
    // (undocumented)
    count<EntityName extends keyof TSchema['entities'] & string>(name: EntityName, args: Pick<ContentClientInput.ListQueryInput<TSchema['entities'][EntityName]>, 'filter'>): ContentQuery<number>;
    // (undocumented)
    create<EntityName extends keyof TSchema['entities'] & string, TValue>(name: EntityName, args: ContentClientInput.CreateInput<TSchema['entities'][EntityName]>, fields?: TypedContentEntitySelectionOrCallback<TSchema, EntityName, TValue>): ContentMutation<MutationResult<TValue>>;
    // (undocumented)
    delete<EntityName extends keyof TSchema['entities'] & string, TValue>(name: EntityName, args: ContentClientInput.UniqueQueryInput<TSchema['entities'][EntityName]>, fields?: TypedContentEntitySelectionOrCallback<TSchema, EntityName, TValue>): ContentMutation<MutationResult<TValue>>;
    // (undocumented)
    fragment<EntityName extends keyof TSchema['entities'] & string>(name: EntityName): TypedEntitySelection<TSchema, EntityName, TSchema['entities'][EntityName], {}>;
    // (undocumented)
    fragment<EntityName extends keyof TSchema['entities'] & string, TFields>(name: EntityName, fieldsCallback: TypedEntitySelectionCallback<TSchema, EntityName, TSchema['entities'][EntityName], TFields>): TypedEntitySelection<TSchema, EntityName, TSchema['entities'][EntityName], TFields>;
    // (undocumented)
    get<EntityName extends keyof TSchema['entities'] & string, TValue>(name: EntityName, args: ContentClientInput.UniqueQueryInput<TSchema['entities'][EntityName]>, fields: TypedContentEntitySelectionOrCallback<TSchema, EntityName, TValue>): ContentQuery<TValue | null>;
    // (undocumented)
    list<EntityName extends keyof TSchema['entities'] & string, TValue>(name: EntityName, args: ContentClientInput.ListQueryInput<TSchema['entities'][EntityName]>, fields: TypedContentEntitySelectionOrCallback<TSchema, EntityName, TValue>): ContentQuery<TValue[]>;
    // (undocumented)
    transaction<Value>(mutation: ContentMutation<Value>, options?: MutationTransactionOptions): ContentMutation<TransactionResult<Value>>;
    // (undocumented)
    transaction<Value>(mutations: ContentMutation<Value>[], options?: MutationTransactionOptions): ContentMutation<TransactionResult<Value[]>>;
    // (undocumented)
    transaction<Values extends Record<string, any>>(mutations: {
        [K in keyof Values]: ContentMutation<Values[K]> | ContentQuery<Values[K]>;
    }, options?: MutationTransactionOptions): ContentMutation<TransactionResult<Values>>;
    // (undocumented)
    update<EntityName extends keyof TSchema['entities'] & string, TValue>(name: EntityName, args: ContentClientInput.UpdateInput<TSchema['entities'][EntityName]>, fields?: TypedContentEntitySelectionOrCallback<TSchema, EntityName, TValue>): ContentMutation<MutationResult<TValue>>;
    // (undocumented)
    upsert<EntityName extends keyof TSchema['entities'] & string, TValue>(name: EntityName, args: ContentClientInput.UpsertInput<TSchema['entities'][EntityName]>, fields?: TypedContentEntitySelectionOrCallback<TSchema, EntityName, TValue>): ContentMutation<MutationResult<TValue>>;
}

// @public (undocumented)
export interface TypedEntitySelection<TSchema extends SchemaTypeLike, TEntityName extends string, TEntity extends EntityTypeLike, TValue> {
    // (undocumented)
    $$(): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in keyof TEntity['columns']]: TEntity['columns'][key];
    }>;
    // (undocumented)
    $<TKey extends (keyof TEntity['columns']) & string, TAlias extends string | null = null>(name: TKey, args?: {
        as?: TAlias;
    }): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in TAlias extends null ? TKey : TAlias]: TEntity['columns'][key];
    }>;
    // (undocumented)
    $<TNestedValue, TNestedKey extends keyof TEntity['hasMany'] & string, TAlias extends string | null = null>(name: TNestedKey, args: ContentClientInput.HasManyRelationInput<TEntity['hasMany'][TNestedKey]> & {
        as?: TAlias;
    }, fields: TypedEntitySelectionCallback<TSchema, TEntity['hasMany'][TNestedKey]['name'], TEntity['hasMany'][TNestedKey], TNestedValue> | TypedEntitySelection<TSchema, TEntity['hasMany'][TNestedKey]['name'], TEntity['hasMany'][TNestedKey], TNestedValue>): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in TAlias extends null ? TNestedKey : TAlias]: TNestedValue[];
    }>;
    // (undocumented)
    $<TNestedValue, TNestedKey extends keyof TEntity['hasMany'] & string, TAlias extends string | null = null>(name: TNestedKey, fields: TypedEntitySelectionCallback<TSchema, TEntity['hasMany'][TNestedKey]['name'], TEntity['hasMany'][TNestedKey], TNestedValue> | TypedEntitySelection<TSchema, TEntity['hasMany'][TNestedKey]['name'], TEntity['hasMany'][TNestedKey], TNestedValue>): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in TAlias extends null ? TNestedKey : TAlias]: TNestedValue[];
    }>;
    // (undocumented)
    $<TNestedValue, TNestedKey extends keyof TEntity['hasManyBy'] & string, TAlias extends string | null = null>(name: TNestedKey, args: ContentClientInput.HasManyByRelationInput<TEntity['hasManyBy'][TNestedKey]['entity'], TEntity['hasManyBy'][TNestedKey]['by']> & {
        as?: TAlias;
    }, fields: TypedEntitySelectionCallback<TSchema, TEntity['hasManyBy'][TNestedKey]['entity']['name'], TEntity['hasManyBy'][TNestedKey]['entity'], TNestedValue> | TypedEntitySelection<TSchema, TEntity['hasManyBy'][TNestedKey]['entity']['name'], TEntity['hasManyBy'][TNestedKey]['entity'], TNestedValue>): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in TAlias extends null ? TNestedKey : TAlias]: null | TNestedValue;
    }>;
    // (undocumented)
    $<TNestedValue, TNestedKey extends keyof TEntity['hasManyBy'] & string, TAlias extends string | null = null>(name: TNestedKey, fields: TypedEntitySelectionCallback<TSchema, TEntity['hasManyBy'][TNestedKey]['entity']['name'], TEntity['hasManyBy'][TNestedKey]['entity'], TNestedValue> | TypedEntitySelection<TSchema, TEntity['hasManyBy'][TNestedKey]['entity']['name'], TEntity['hasManyBy'][TNestedKey]['entity'], TNestedValue>): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in TAlias extends null ? TNestedKey : TAlias]: null | TNestedValue;
    }>;
    // (undocumented)
    $<TNestedValue extends {
        [K in string]: unknown;
    }, TNestedKey extends keyof TEntity['hasOne'] & string, TAlias extends string | null = null>(name: TNestedKey, args: ContentClientInput.HasOneRelationInput<TEntity['hasOne'][TNestedKey]> & {
        as?: TAlias;
    }, fields: TypedEntitySelectionCallback<TSchema, TEntity['hasOne'][TNestedKey]['name'], TEntity['hasOne'][TNestedKey], TNestedValue> | TypedEntitySelection<TSchema, TEntity['hasOne'][TNestedKey]['name'], TEntity['hasOne'][TNestedKey], TNestedValue>): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in TAlias extends null ? TNestedKey : TAlias]: TNestedValue | null;
    }>;
    // (undocumented)
    $<TNestedValue extends {
        [K in string]: unknown;
    }, TNestedKey extends keyof TEntity['hasOne'] & string, TAlias extends string | null = null>(name: TNestedKey, fields: TypedEntitySelectionCallback<TSchema, TEntity['hasOne'][TNestedKey]['name'], TEntity['hasOne'][TNestedKey], TNestedValue> | TypedEntitySelection<TSchema, TEntity['hasOne'][TNestedKey]['name'], TEntity['hasOne'][TNestedKey], TNestedValue>): TypedEntitySelection<TSchema, TEntityName, TEntity, TValue & {
        [key in TAlias extends null ? TNestedKey : TAlias]: TNestedValue | null;
    }>;
}

// @public (undocumented)
export type TypedEntitySelectionCallback<TSchema extends SchemaTypeLike, EntityName extends string, TEntity extends EntityTypeLike, TValue> = (select: TypedEntitySelection<TSchema, EntityName, TEntity, {}>) => TypedEntitySelection<TSchema, EntityName, TEntity, TValue>;

// @public (undocumented)
export type ValidationError = {
    readonly path: Path;
    readonly message: {
        text: string;
    };
};

// @public (undocumented)
export type ValidationResult = {
    readonly valid: boolean;
    readonly errors: ValidationError[];
};

// (No @packageDocumentation comment for this package)

```