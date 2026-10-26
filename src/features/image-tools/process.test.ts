import { describe, expect, it } from "vitest";
import { beautifyPixels, initialOptions } from "./process";

describe("图片美颜", () => {
  it("零强度保持原像素和透明度，不修改输入", () => {
    const pixels = new Uint8ClampedArray([180, 130, 100, 80, 20, 30, 200, 255]);
    const copy = pixels.slice();
    expect(beautifyPixels(pixels, new Uint8ClampedArray(8), { ...initialOptions, smooth: 0, brighten: 0, warmth: 0 })).toEqual(copy);
    expect(pixels).toEqual(copy);
  });
  it("柔化肤色，保留非肤色与强边缘", () => {
    const pixels = new Uint8ClampedArray([180, 130, 100, 255, 20, 30, 200, 128, 240, 100, 50, 255]);
    const blurred = new Uint8ClampedArray([170, 120, 90, 255, 30, 40, 190, 128, 100, 100, 100, 255]);
    const out = beautifyPixels(pixels, blurred, { ...initialOptions, smooth: 100, brighten: 0, warmth: 0 });
    expect(out[0]).toBeLessThan(pixels[0]);
    expect(out.slice(4)).toEqual(pixels.slice(4));
  });
  it("提亮与冷暖调整限制在字节范围，保留透明度", () => {
    const pixels = new Uint8ClampedArray([250, 200, 0, 25]);
    const out = beautifyPixels(pixels, pixels, { ...initialOptions, brighten: 100, warmth: 50 });
    expect(out[0]).toBe(255);
    expect(out[1]).toBeGreaterThan(200);
    expect(out[3]).toBe(25);
  });
});
