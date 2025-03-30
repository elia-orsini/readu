/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const xml2js = require("xml2js");
const { decode } = require("html-entities");

async function processEPUB(filePath) {
  const data = await fs.promises.readFile(filePath);
  const zip = await JSZip.loadAsync(data);

  // Extract EPUB metadata and chapters
  const container = await zip.file("META-INF/container.xml").async("text");
  const opfPath = await extractOPFPath(container);
  const opfContent = await zip.file(opfPath).async("text");

  const { title, chapters } = await parseOPF(opfContent, zip, path.dirname(opfPath));

  return { title, chapters };
}

async function extractOPFPath(containerXml) {
  const result = await xml2js.parseStringPromise(containerXml);
  return result.container.rootfiles[0].rootfile[0].$["full-path"];
}

async function parseOPF(opfXml, zip, opfDir) {
  const result = await xml2js.parseStringPromise(opfXml);
  const metadata = result.package.metadata[0];
  const manifest = result.package.manifest[0].item;
  const spine = result.package.spine[0].itemref;

  // Properly extract title (handle xml2js object structure)
  const title = metadata["dc:title"]?.[0]?._ || metadata["dc:title"]?.[0] || "Untitled";

  const chapters = await Promise.all(
    spine.map(async (item) => {
      const id = item.$.idref;
      const manifestItem = manifest.find((m) => m.$.id === id);
      const content = await extractChapterContent(zip, path.join(opfDir, manifestItem.$.href));
      return {
        id,
        // Ensure we're using the text content, not the xml2js object
        title: manifestItem.$.id, // This is already a string from attributes
        content,
      };
    })
  );

  return { title, chapters };
}

async function extractChapterContent(zip, filePath) {
  const content = await zip.file(filePath).async("text");
  return cleanContent(content);
}

function cleanContent(html) {
  let text = decode(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

module.exports = { processEPUB };
