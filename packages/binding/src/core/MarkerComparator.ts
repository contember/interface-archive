import {
	EntityFieldMarkersContainer,
	EntityListSubTreeMarker,
	EntitySubTreeMarker,
	FieldMarker,
	HasManyRelationMarker,
	HasOneRelationMarker,
} from '../markers'
import { assertNever } from '../utils'
import { LocalizedBindingError } from './exceptions'

export class MarkerComparator {
	public static assertEntityMarkersSubsetOf(
		candidate: EntityFieldMarkersContainer,
		superset: EntityFieldMarkersContainer,
	) {
		this.assertSubsetOf(candidate, superset)
	}

	private static assertSubsetOf(candidate: EntityFieldMarkersContainer, superset: EntityFieldMarkersContainer) {
		for (const [placeholderName, candidateMarker] of candidate.markers) {
			if (candidateMarker instanceof EntitySubTreeMarker || candidateMarker instanceof EntityListSubTreeMarker) {
				continue // We don't handle sub trees from here.
			}

			const fromSuperset = superset.markers.get(placeholderName)

			if (fromSuperset === undefined) {
				if (candidateMarker instanceof FieldMarker) {
					throw new LocalizedBindingError(`The field '${candidateMarker.fieldName}' is missing.`, [candidateMarker])
				}
				if (candidateMarker instanceof HasOneRelationMarker || candidateMarker instanceof HasManyRelationMarker) {
					const differentPlaceholders = superset.placeholders.get(candidateMarker.parameters.field)

					if (differentPlaceholders === undefined) {
						throw new LocalizedBindingError(`The relation '${candidateMarker.parameters.field}' is missing.`, [
							candidateMarker,
						])
					}
					// TODO be more specific
					throw new LocalizedBindingError(
						`The relation '${candidateMarker.parameters.field}' exists but its parameters don't match exactly. ` +
							`Check that all relation parameters are the same.`,
						[candidateMarker],
					)
				}
				assertNever(candidateMarker)
			}
			if (candidateMarker instanceof FieldMarker) {
				continue
			}
			try {
				if (
					(candidateMarker instanceof HasOneRelationMarker && fromSuperset instanceof HasOneRelationMarker) ||
					(candidateMarker instanceof HasManyRelationMarker && fromSuperset instanceof HasManyRelationMarker)
				) {
					this.assertSubsetOf(candidateMarker.fields, fromSuperset.fields)
				}
			} catch (e) {
				if (e instanceof LocalizedBindingError) {
					throw e.nestedIn(candidateMarker)
				}
				throw e
			}
		}
	}

	//private static assertAreMarkersSubsetOf(): {}
}
