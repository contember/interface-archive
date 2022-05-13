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

	public getTreePosition(): Environment.TreePosition {
		if (!this.options.treePosition) {
			throw new BindingError()
		}
		return this.options.treePosition
	}

	public withSubtree(subtree: Pick<Environment.TreePosition, 'subtreeEntity' | 'subtreeExpectedCardinality' | 'subtreeType' | 'subtreeFilter'>) {
		return new Environment({
			...this.options,
			treePosition: {
				...subtree,
				rootEntity: this.options.treePosition?.rootEntity ?? subtree.subtreeEntity,
				rootFilter: this.options.treePosition?.rootFilter ?? subtree.subtreeFilter,
				nodeEntity: subtree.subtreeEntity,
				nodeType: subtree.subtreeType,
				nodePath: [],
			},
		})
	}

	public withTreeNode(node: Pick<Environment.TreePosition, 'nodeType' | 'nodeEntity'>, path: string[]) {
		if (!this.options.treePosition) {
			throw new BindingError()
		}
		return new Environment({
			...this.options,
			treePosition: {
				...this.options.treePosition,
				nodePath: [...this.options.treePosition.nodePath, ...path],
				nodeEntity: node.nodeEntity,
				nodeType: node.nodeType,
			},
		})
	}

	public withVariables(variables: Environment.ValuesMapWithFactory | undefined): Environment {
		if (variables === undefined) {
			return this
		}
		const resolvedVariablesEntries: [string, Environment.Value][] = Object.entries(variables).map(
			([name, value]) => {
				if (name === 'labelMiddleware') {
					throw new BindingError('You cannot pass labelMiddleware to withVariables method. Use withLabelMiddleware instead.')
				}
				return [
					name,
					typeof value === 'function' ? value(this) : value,
				]
			},
		)
		const newVariables = { ...this.options.variables }
		for (const [newName, newValue] of resolvedVariablesEntries) {
			if (newValue === undefined) {
				delete newVariables[newName]
			} else {
				newVariables[newName] = newValue
			}
		}
		return new Environment({ ...this.options, variables: newVariables })
	}

	public getVariable(key: string): Environment.Value {
		return this.options.variables[key]
	}

	public withParameters(parameters: Environment.Parameters): Environment {
		return new Environment({ ...this.options, parameters })
	}

	public withDimensions(dimensions: Environment.SelectedDimensions): Environment {
		const newDimensions = {
			...this.options.dimensions,
			...dimensions,
		}
		if (JSON.stringify(newDimensions) === JSON.stringify(this.options.dimensions)) {
			return this
		}
		return new Environment({ ...this.options, dimensions: newDimensions })
	}

	public hasDimension(dimensionName: string): boolean {
		return dimensionName in this.options.dimensions
	}

	public getDimension(dimensionName: string): string[] {
		if (!(dimensionName in this.options.dimensions)) {
			throw new BindingError(`Dimension ${dimensionName} does not exist.`)
		}
		return this.options.dimensions[dimensionName]
	}

	public getAllDimensions(): Environment.SelectedDimensions {
		return this.options.dimensions
	}

	public withLabelMiddleware(labelMiddleware: Environment.Options['labelMiddleware']) {
		return new Environment({ ...this.options, labelMiddleware })
	}

	public applyLabelMiddleware(label: React.ReactNode): React.ReactNode {
		return this.options['labelMiddleware'](label, this)
	}

	public merge(other: Environment): Environment {
		if (other === this) {
			return this
		}
		if (!equal(this.options.treePosition, other.options.treePosition)) {
			throw new BindingError(`Cannot merge two environments with different tree position.`)
		}
		if (!equal(this.options.parameters, other.options.parameters)) {
			throw new BindingError(`Cannot merge two environments with different parameters.`)
		}
		if (!equal(this.options.dimensions, other.options.dimensions)) {
			throw new BindingError(`Cannot merge two environments with different dimensions.`)
		}
		if (equal(this.options.variables, other.options.variables)) {
			return this
		}
		for (const key in other.options.variables) {
			if (key in this.options.variables && !equal(this.options.variables[key], other.options.variables[key])) {
				throw new BindingError(`Cannot merge two environments with different value of variable ${key}.`)
			}
		}

		return new Environment({
			...this.options,
			variables: { ...this.options.variables, ...other.options.variables },
		})
	}


	public resolveValue(key: string): Environment.ResolvedValue | undefined {
		switch (key) {
			case 'rootFilter':
			case 'rootWhereAsFilter':
				return this.options.treePosition?.rootFilter
		}

		if (key in this.options.variables) {
			return this.options.variables[key]
		}
		if (key in this.options.parameters) {
			return this.options.parameters[key]
		}
		if (key in this.options.dimensions) {
			const dimensionValue = this.options.dimensions[key]
			if (dimensionValue.length > 1) {
				throw new BindingError(`The variable \$${key} resolved to a dimension which exists but contains ${dimensionValue.length} values. It has to contain exactly one. ` +
					`Perhaps you forgot to set the 'maxItems' prop of your DimensionsSwitcher?`)
			}
			return dimensionValue[0]
		}
		return undefined
	}

	/**
	 * @deprecated use resolveValue
	 */
	public getValueOrElse<F>(key: string, fallback: F): Filter | Environment.Value | F {
		return this.resolveValue(key) ?? fallback
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
}

namespace Environment {
	export type Name = string

	export type Value = ReactNode

	export type ResolvedValue = Value | Filter

	export type LabelMiddleware = (label: ReactNode, environment: Environment) => ReactNode

	export interface Options {
		treePosition?: TreePosition
		schema?: Schema
		dimensions: SelectedDimensions
		parameters: Parameters
		variables: CustomVariables
		labelMiddleware: LabelMiddleware
	}

	export interface TreePosition {
		rootEntity: string
		rootFilter: Filter

		subtreeEntity: string
		subtreeType: 'list' | 'entity'
		subtreeExpectedCardinality: 'many' | 'zero' | 'one' | 'zero-one'
		subtreeFilter: Filter

		nodePath: string[]
		nodeEntity: string
		nodeType: 'list' | 'entity'
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
