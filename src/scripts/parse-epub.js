const { parseEpub } = require("@gxl/epub-parser");
const { decode } = require("html-entities");

async function processEPUB(filePath) {
  try {
    const epubObj = await parseEpub(filePath, {
      type: "path",
    });

    const title = epubObj.info.title["_"] || epubObj.info.title || "Untitled";

    const chapters = epubObj.sections.map((section, i) => {
      const content = section.toMarkdown();

      return {
        id: section.id,
        title: epubObj.structure[i] ? epubObj.structure[i].name : "Untitled Chapter",
        content,
      };
    });

    console.log(chapters);

    return { title, chapters };
  } catch (error) {
    console.error("Error processing EPUB:", error);
    throw error;
  }
}

module.exports = { processEPUB };

// processEPUB("./sever.epub");
