import type { ReactNode } from 'react'
import { BindingError } from '../BindingError'
import type { Filter } from '../treeParameters'
import equal from 'fast-deep-equal/es6'
import { Schema } from '../core/schema'

class Environment {
	private constructor(
		private readonly options: Environment.Options,
	) {
	}

	public static create() {
		return new Environment({
			labelMiddleware: label => label,
			dimensions: {},
			variables: {},
			parameters: {},
		})
	}

	public getSubtree(): Environment.Subtree {
		if (!this.options.subtree) {
			throw new BindingError()
		}
		return this.options.subtree
	}

	public getSubtreeLocation(): Environment.SubtreeLocation {
		if (!this.options.subtreeLocation) {
			throw new BindingError()
		}
		return this.options.subtreeLocation
	}

	public withSubtree(subtree: Environment.Subtree) {
		return new Environment({
			...this.options,
			subtree,
			subtreeLocation: {
				entity: subtree.entity,
				path: [],
			},
		})
	}

	public withTreeChild({ field }: { field: string }) {
		if (!this.options.subtreeLocation) {
			throw new BindingError()
		}
		const schema = this.getSchema()
		const fieldSchema = schema.getEntityField(this.options.subtreeLocation.entity, field)
		if (!fieldSchema) {
			throw new BindingError()
		}
		const targetEntity = fieldSchema.__typename === '_Relation'
			? fieldSchema.targetEntity
			: this.options.subtreeLocation.entity
		return new Environment({
			...this.options,
			subtreeLocation: {
				entity: targetEntity,
				path: [...this.options.subtreeLocation.path, field],
			},
			parent: this,
		})
	}


	public hasVariable(key: string): boolean {
		return key in this.options.variables
	}

	public getVariable<F>(key: string, fallback: F): Environment.Value | F
	public getVariable(key: string): Environment.Value
	public getVariable<F>(key: string, fallback?: F): Environment.Value | F {
		if (!(key in this.options.variables)) {
			if (arguments.length > 1) {
				return fallback
			}
			throw new BindingError(`Variable ${key} not found`)
		}
		return this.options.variables[key]
	}

	/** @deprecated use getVariable */
	public getValueOrElse<F>(key: string, fallback: F): Environment.Value | F {
		return this.getVariable(key, fallback)
	}


	public withVariables(variables: Environment.ValuesMapWithFactory | undefined): Environment {
		if (variables === undefined) {
			return this
		}
		const newVariables = { ...this.options.variables }
		for (const [newName, newValue] of Object.entries(variables)) {
			if (newName === 'labelMiddleware') {
				throw new BindingError('You cannot pass labelMiddleware to withVariables method. Use withLabelMiddleware instead.')
			}
			const resolvedValue = typeof newValue === 'function' ? newValue(this) : newValue
			if (resolvedValue === undefined) {
				delete newVariables[newName]
			} else {
				newVariables[newName] = resolvedValue
			}
		}
		return new Environment({ ...this.options, variables: newVariables })
	}

	public hasParameter(key: string): boolean {
		return key in this.options.parameters
	}

	public getParameter<F>(key: string, fallback: F): string | F
	public getParameter(key: string): string
	public getParameter<F>(key: string, fallback?: F): string | F {
		if (!(key in this.options.parameters) || this.options.parameters[key] === undefined) {
			if (arguments.length > 1) {
				return fallback as F
			}
			throw new BindingError(`Parameter ${key} not found`)
		}
		return this.options.parameters[key] as string
	}

	public withParameters(parameters: Environment.Parameters): Environment {
		return new Environment({ ...this.options, parameters })
	}

	public hasDimension(dimensionName: string): boolean {
		return dimensionName in this.options.dimensions
	}

	public getDimension<F>(dimensionName: string, fallback: F): string[] | F
	public getDimension(dimensionName: string): string[]
	public getDimension<F>(dimensionName: string, fallback?: F): string[] | F {
		if (!(dimensionName in this.options.dimensions)) {
			if (arguments.length > 1) {
				return fallback as F
			}
			throw new BindingError(`Dimension ${dimensionName} does not exist.`)
		}
		return this.options.dimensions[dimensionName]
	}
	public getAllDimensions(): Environment.SelectedDimensions {
		return this.options.dimensions
	}

	public withDimensions(dimensions: Environment.SelectedDimensions): Environment {
		const newDimensions = {
			...this.options.dimensions,
			...dimensions,
		}
		if (equal(newDimensions, this.options.dimensions)) {
			return this
		}
		return new Environment({ ...this.options, dimensions: newDimensions })
	}

	public applyLabelMiddleware(label: React.ReactNode): React.ReactNode {
		return this.options['labelMiddleware'](label, this)
	}

	public withLabelMiddleware(labelMiddleware: Environment.Options['labelMiddleware']) {
		return new Environment({ ...this.options, labelMiddleware })
	}

	public getSchema(): Schema {
		if (!this.options.schema) {
			throw new BindingError()
		}
		return this.options.schema
	}

	public withSchema(schema: Schema): Environment {
		return new Environment({ ...this.options, schema })
	}

	get parent(): Environment {
		if (!this.options.parent) {
			throw new BindingError()
		}
		return this.options.parent
	}

	public merge(other: Environment): Environment {
		if (other === this) {
			return this
		}
		if (!equal(this.options.subtreeLocation, other.options.subtreeLocation)) {
			throw new BindingError(`Cannot merge two environments with different tree position.`)
		}
		if (this.options.parameters !== other.options.parameters) {
			throw new BindingError(`Cannot merge two environments with different parameters.`)
		}
		if (this.options.dimensions !== other.options.dimensions) {
			throw new BindingError(`Cannot merge two environments with different dimensions.`)
		}
		if (equal(this.options.variables, other.options.variables) && this.options.parent === other.options.parent) {
			return this
		}
		for (const key in other.options.variables) {
			if (key in this.options.variables && !equal(this.options.variables[key], other.options.variables[key])) {
				throw new BindingError(`Cannot merge two environments with different value of variable ${key}:\n`
					+ JSON.stringify(this.options.variables[key]) + '\n'
					+ JSON.stringify(other.options.variables[key]))
			}
		}

		return new Environment({
			...this.options,
			parent: this.options.parent && other.options.parent ? this.options.parent.merge(other.options.parent) : undefined,
			variables: { ...this.options.variables, ...other.options.variables },
		})
	}
}

namespace Environment {
	export type Name = string

	export type Value = ReactNode

	export type ResolvedValue = Value | Filter

	export type LabelMiddleware = (label: ReactNode, environment: Environment) => ReactNode

	export interface Options {
		subtree?: Subtree
		subtreeLocation?: SubtreeLocation
		schema?: Schema
		dimensions: SelectedDimensions
		parameters: Parameters
		variables: CustomVariables
		labelMiddleware: LabelMiddleware
		parent?: Environment
	}

	export interface Subtree {
		entity: string
		type: 'list' | 'entity'
		expectedCardinality: 'many' | 'zero' | 'one' | 'zero-or-one'
		filter: Filter
	}

	export interface SubtreeLocation {
		path: string[]
		entity: string
	}


	export interface SelectedDimensions {
		[key: string]: string[]
	}

	export interface Parameters {
		[key: string]: string | undefined
	}

	export interface CustomVariables {
		[key: string]: Value
	}

	export interface ValuesMapWithFactory {
		[key: string]:
			| ((environment: Environment) => Value)
			| Value
	}

	/** @deprecated */
	export type DeltaFactory = ValuesMapWithFactory
}

export { Environment }
