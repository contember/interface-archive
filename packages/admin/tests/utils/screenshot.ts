import { expect, WorkerGlobalState } from 'vitest'
import type { Page } from 'puppeteer'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

declare let __vitest_worker__: WorkerGlobalState

const matrix = {
	'1080p-light': { width: 1903, height: 1009, colorSchema: 'light' },
	'1080p-dark': { width: 1903, height: 1009, colorSchema: 'dark' },

	'iphone8-light': { width: 375, height: 667, colorSchema: 'light' },
	'iphone8-dark': { width: 375, height: 667, colorSchema: 'dark' },

	'ipad-light': { width: 1112, height: 834, colorSchema: 'light' },
	'ipad-dark': { width: 1112, height: 834, colorSchema: 'dark' },
}

export async function assertScreenshot(page: Page, name: string) {
	for (let [suffix, { width, height, colorSchema }] of Object.entries(matrix)) {
		await page.setViewport({ width, height })
		await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: colorSchema }])
		await page.waitForNetworkIdle()
		await assertScreenshotInternal(page, name + '-' + suffix)
	}
}

export async function assertScreenshotInternal(page: Page, name: string) {
	const actualBytes = await page.screenshot()
	const actualImg = PNG.sync.read(actualBytes as Buffer)
	const path = `tests/screenshots/${name}.png`

	const updateSnapshot = __vitest_worker__.ctx.config.snapshotOptions.updateSnapshot

	if (updateSnapshot === 'all' || (updateSnapshot === 'new' && !existsSync(path))) {
		await writeFile(path, actualBytes)
		return
	}

	const expectedBytes = await readFile(path)
	const expectedImg = PNG.sync.read(expectedBytes as Buffer)

	expect(actualImg.width).toBe(expectedImg.width)
	expect(actualImg.height).toBe(expectedImg.height)

	const diff = new PNG({ width: expectedImg.width, height: expectedImg.height })
	const changedPixelCount = pixelmatch(actualImg.data, expectedImg.data, diff.data, expectedImg.width, expectedImg.height)

	if (changedPixelCount > 0) {
		await writeFile(`tests/screenshots/${name}.diff.png`, PNG.sync.write(diff))
	}

	expect(changedPixelCount).toBe(0)
}
