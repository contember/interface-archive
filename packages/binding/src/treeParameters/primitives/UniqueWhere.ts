import type { GraphQlBuilder, Input } from '@contember/client'

export type UniqueWhere<T = GraphQlBuilder.Literal> = Input.UniqueWhere<T>

// E.g. (author.mother.id = 123)
// It is *always* enclosed within parentheses
export type SugaredUniqueWhere = UniqueWhere | string
