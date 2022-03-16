import { afterAll, beforeAll, describe, test } from 'vitest'
import type { PreviewServer } from 'vite'
import { build, preview } from 'vite'
import type { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer'
import { assertScreenshot } from '../../utils/screenshot'

describe('screenshots', async () => {
	let server: PreviewServer
	let browser: Browser
	let page: Page

	beforeAll(async () => {
		// await build({
		// 	root: '../admin-sandbox/admin',
		// 	mode: 'test',
		// 	configFile: '../admin-sandbox/vite.config.ts',
		// })

		server = await preview({
			preview: { port: 3333 },
			root: '../admin-sandbox/admin',
			mode: 'test',
		})

		browser = await puppeteer.launch({ args: ['--font-render-hinting=none'] })
		page = await browser.newPage()
	})

	afterAll(async () => {
		await browser.close()
		await server.httpServer.close()
	})

	test('index', async () => {
		await page.goto('http://localhost:3333')
		await assertScreenshot(page, 'index')
	}, 60_000)

	test('inputs', async () => {
		await page.goto('http://localhost:3333/inputs')
		await assertScreenshot(page, 'inputs')
	}, 60_000)
})
