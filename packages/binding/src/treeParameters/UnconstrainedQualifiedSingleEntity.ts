import type {
	EntityCreationParameters,
	SugarableEntityCreationParameters,
	UnsugarableEntityCreationParameters,
} from './EntityCreationParameters'
import type { HasOneRelation, SugarableHasOneRelation } from './HasOneRelation'
import type {
	QualifiedEntityParameters,
	SugarableQualifiedEntityParameters,
	UnsugarableQualifiedEntityParameters,
} from './QualifiedEntityParameters'
import type {
	SingleEntityEventListeners,
	SugarableSingleEntityEventListeners,
	UnsugarableSingleEntityEventListeners,
} from './SingleEntityEventListeners'

export interface UnconstrainedQualifiedSingleEntity
	extends QualifiedEntityParameters,
		EntityCreationParameters,
		SingleEntityEventListeners {
	isCreating: true
	hasOneRelationPath: HasOneRelation[]
}

export interface SugarableUnconstrainedQualifiedSingleEntity
	extends SugarableQualifiedEntityParameters,
		SugarableEntityCreationParameters,
		SugarableSingleEntityEventListeners {
	hasOneRelationPath?: SugarableHasOneRelation[] | SugarableHasOneRelation
}

export interface UnsugarableUnconstrainedQualifiedSingleEntity
	extends UnsugarableQualifiedEntityParameters,
		UnsugarableEntityCreationParameters,
		UnsugarableSingleEntityEventListeners {
	isCreating: true
	// Deliberately leaving out UnsugarableHasOneRelation
}

// E.g. Author.son.sisters(name = 'Jane')
export interface SugaredUnconstrainedQualifiedSingleEntity extends UnsugarableUnconstrainedQualifiedSingleEntity {
	entity: string | SugarableUnconstrainedQualifiedSingleEntity
}
