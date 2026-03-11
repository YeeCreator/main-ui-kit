import { expect, test } from '@playwright/test';

/**
 * web-host 闭环端到端测试。
 */
test.describe('web-host E2E', () => {
  test('平移与缩放按钮应更新相机状态文本', async ({ page }) => {
    await page.goto('/');

    const initialText = await page.getByText(/相机：\(/).innerText();

    await page.getByTestId('btn-pan-camera').click();
    const afterPanText = await page.getByText(/相机：\(/).innerText();
    expect(afterPanText).not.toBe(initialText);

    await page.getByTestId('btn-zoom-camera').click();
    const afterZoomText = await page.getByText(/相机：\(/).innerText();
    expect(afterZoomText).not.toBe(afterPanText);
  });

  test('导出 JSON 文件应包含标准结构', async ({ page }) => {
    await page.goto('/');

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('btn-export').click();
    const download = await downloadPromise;

    const stream = await download.createReadStream();
    let content = '';

    if (stream) {
      for await (const chunk of stream) {
        content += chunk.toString();
      }
    }

    const payload = JSON.parse(content) as {
      scene?: unknown;
      entities?: unknown;
      metadata?: { version?: string };
    };

    expect(payload.scene).toBeTruthy();
    expect(Array.isArray(payload.entities)).toBeTruthy();
    expect(payload.metadata?.version).toBe('1.0.0');
  });

  test('导入合法 JSON 后应更新场景状态', async ({ page }) => {
    await page.goto('/');

    const nodeCountBefore = await page.getByTestId('node-count').innerText();
    expect(nodeCountBefore).toContain('节点数量：1');

    const scenePayload = {
      scene: {
        version: '1.0.0',
        sceneId: 'imported-scene-1',
        mode: 'canvas',
        nodes: [
          { id: 'import-node-1', type: 'rect', x: 22, y: 33 },
          { id: 'import-node-2', type: 'circle', x: 44, y: 55 },
        ],
        modeExtensions: {},
      },
      level: { sceneId: 'imported-scene-1', mode: 'canvas' },
      entities: [],
      metadata: { version: '1.0.0', exportedAt: '2026-03-11T00:00:00.000Z' },
    };

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('btn-import').click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles({
      name: 'valid-bundle.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(scenePayload), 'utf-8'),
    });

    await expect(page.getByTestId('status-text')).toContainText('已完成导入并更新场景');
    await expect(page.getByTestId('node-count')).toContainText('节点数量：2');
    await expect(page.getByText('import-node-2')).toBeVisible();
  });

  test('导入非法 JSON 时应提示失败且页面不中断', async ({ page }) => {
    await page.goto('/');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('btn-import').click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles({
      name: 'invalid-bundle.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"scene": {"sceneId": "bad"}}', 'utf-8'),
    });

    await expect(page.getByTestId('status-text')).toContainText('导入失败');
    await expect(page.getByRole('heading', { name: 'Scene-Kit Web Host' })).toBeVisible();
  });
});
