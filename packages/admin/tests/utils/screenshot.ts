import { expect, WorkerGlobalState } from 'vitest'
import type { Page } from 'puppeteer'
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

declare let __vitest_worker__: WorkerGlobalState

export async function assertScreenshot(page: Page, name: string) {
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
