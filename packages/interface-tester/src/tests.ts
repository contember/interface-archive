import { join, relative } from 'node:path'
import { inspect } from 'node:util'

import { ReactNode } from 'react'
import FastGlob from 'fast-glob'
import micromatch from 'micromatch'

import { Environment, MarkerTreeGenerator } from '@contember/admin'

import { Config, PageConfig } from './config'
import { createEnvironment } from './environment'
import { createNode } from './nodes'
import { createModelForRole } from './schema'

export interface Test {
	testName: string
	path: string
	relativePath: string
	role: string
	exportedAs: string
	export: unknown
	pageConfig: PageConfig
	environment: Environment
	execute: () => void
}


export const getTests = async (config: Config): Promise<Test[]> => {
	const pageBaseDir = join(process.cwd(), config.pagesDir ?? 'pages')
	const pages = await FastGlob(join(pageBaseDir, config.include ?? '**/*.tsx'))

	const ignored = config.exclude ? Array.isArray(config.exclude)
		? config.exclude
		: [config.exclude]
		: []

	const tests: Test[] = []
	for (const pagePath of pages) {
		const relativePath = relative(pageBaseDir, pagePath)
		if (micromatch.isMatch(relativePath, ignored)) {
			continue
		}

		const exports = await import(pagePath)
		for (const [name, _export] of Object.entries(exports) as any) {
			const testName = `${relativePath}/${name}`
			if (micromatch.isMatch(testName, ignored)) {
				continue
			}
			let pageConfig: PageConfig = {}
			for (const [pattern, itConfig] of Object.entries(config.pages ?? {})) {
				if (micromatch.isMatch(relativePath, pattern) || micromatch.isMatch(testName, pattern)) {
					pageConfig = {
						...itConfig,
						...pageConfig,
					}
				}
			}
			pageConfig = {
				...config,
				...pageConfig,
			}
			for (const role of pageConfig.roles ?? ['admin']) {
				const model = createModelForRole(config.schema, role)
				const environment = createEnvironment({ model, role, pageConfig })
				tests.push({
					testName,
					path: pagePath,
					relativePath,
					exportedAs: name,
					export: _export,
					environment,
					role,
					pageConfig,
					execute: () => {
						const node = (pageConfig?.createNode ?? createNode)(_export)
						;(pageConfig?.testNode ?? testNode)(node, environment, _export)
					},
				})
			}
		}
	}
	return tests
}


export const testNode = (node: ReactNode | undefined, environment: Environment, originalExport: unknown) => {
	if (node === undefined) {
		throw new Error(`Unsupported export: ` + inspect(originalExport))
	}
	new MarkerTreeGenerator(node, environment).generate()
}


