import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assert } from "chai";

const here = dirname(fileURLToPath(import.meta.url));

const OUTLINE_ICON_WIDTHS: Record<string, string> = {
  "action-add-text.svg": "1.5",
  "action-clear.svg": "1.5",
  "action-delete.svg": "1.5",
  "action-edit.svg": "1.5",
  "action-export.svg": "1.5",
  "action-file.svg": "1.5",
  "action-fork.svg": "1.25",
  "action-history-clock.svg": "1.5",
  "action-history-new.svg": "1.5",
  "action-image.svg": "1.5",
  "action-model-chip.svg": "1.5",
  "action-model-quote.svg": "1.5",
  "action-note.svg": "1.5",
  "action-paper.svg": "1.5",
  "action-papers.svg": "1.125",
  "action-pdf-page.svg": "1.5",
  "action-popout.svg": "1",
  "action-reasoning-brain.svg": "1.5",
  "action-retry.svg": "1.5",
  "action-screenshot.svg": "1.5",
  "action-skill.svg": "1.5",
  "action-slash.svg": "1.5",
  "action-source-code.svg": "1.5",
  "action-text-context.svg": "1.5",
  "action-upload-file.svg": "1.5",
  "action-word-wrap.svg": "1.5",
  "citation-jump.svg": "1",
};

describe("outline icon stroke consistency", function () {
  it("uses Lucide's square-pen geometry for new conversations", function () {
    const svg = readFileSync(
      resolve(here, "../addon/content/icons/action-history-new.svg"),
      "utf8",
    );

    assert.include(svg, 'viewBox="0 0 24 24"');
    assert.include(
      svg,
      'd="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"',
    );
    assert.include(svg, "M18.375 2.625a1 1 0 0 1 3 3");
  });

  it("uses a compact reverse-clock outline for conversation history", function () {
    const svg = readFileSync(
      resolve(here, "../addon/content/icons/action-history-clock.svg"),
      "utf8",
    );

    assert.include(svg, 'viewBox="0 0 24 24"');
    assert.include(svg, "M3 12a9 9 0 1 0 3-6.708L3 8");
    assert.include(svg, 'd="M3 3v5h5"');
    assert.include(svg, 'd="M12 7v5l4 2"');
  });

  it("uses Zotero-equivalent effective stroke widths for every outline asset", function () {
    for (const [name, expectedWidth] of Object.entries(OUTLINE_ICON_WIDTHS)) {
      const svg = readFileSync(
        resolve(here, "../addon/content/icons", name),
        "utf8",
      );
      const widths = [...svg.matchAll(/stroke-width="([^"]+)"/g)].map(
        (match) => match[1],
      );

      assert.isNotEmpty(widths, `${name} should define an outline stroke`);
      assert.deepEqual(
        [...new Set(widths)],
        [expectedWidth],
        `${name} should keep one normalized source stroke width`,
      );
    }
  });

  it("keeps embedded 24px and 20px outline masks on the same scale", function () {
    const css = readFileSync(
      resolve(here, "../addon/content/zoteroPane.css"),
      "utf8",
    );
    const encodedWidths = [
      ...css.matchAll(/stroke-width%3D%22([0-9.]+)%22/g),
    ].map((match) => match[1]);
    const literalWidths = [...css.matchAll(/stroke-width='([0-9.]+)'/g)].map(
      (match) => match[1],
    );

    assert.isNotEmpty(encodedWidths);
    assert.isNotEmpty(literalWidths);
    assert.sameMembers([...new Set(encodedWidths)], ["1.5", "1.25"]);
    assert.deepEqual([...new Set(literalWidths)], ["1.5"]);
  });
});
