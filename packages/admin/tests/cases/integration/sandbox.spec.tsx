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

		browser = await puppeteer.launch()
		page = await browser.newPage()
	})

	afterAll(async () => {
		await browser.close()
		await server.httpServer.close()
	})

	test('index', async () => {
		await page.goto('http://localhost:3333')
		await page.setViewport({ width: 1920, height: 1080 })
		await page.waitForNetworkIdle()
		await assertScreenshot(page, 'index')
	})

	test('inputs', async () => {
		await page.goto('http://localhost:3333/inputs')
		await page.setViewport({ width: 1920, height: 1080 })
		await page.waitForNetworkIdle()
		await assertScreenshot(page, 'inputs')
	})
})
