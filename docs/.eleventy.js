module.exports = function(eleventyConfig) {
  // Copia assets, manifest e SW direto pro build
  eleventyConfig.addPassthroughCopy("docs/assets");
  eleventyConfig.addPassthroughCopy("docs/manifest.json");
  eleventyConfig.addPassthroughCopy("docs/service-worker.js");

  return {
    // input: onde ficam teus MD/templates
    dir: {
      input: "docs/pages",
      layouts: "../layouts",   // cria pasta layouts/ com header/footer
      output: "docs/_site"
    },
    // opcional: ignora arquivos ocultos
    templateFormats: ["html", "md"]
  };
};


const Image = require("@11ty/eleventy-img");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const seo = require("eleventy-plugin-seo");
const critical = require("eleventy-plugin-critical-css");
const sitemap = require("eleventy-plugin-sitemap");
const rss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // 1) Passthrough
  eleventyConfig.addPassthroughCopy("docs/assets/icons");
  eleventyConfig.addPassthroughCopy("docs/manifest.json");

  // 2) Plugins
  eleventyConfig.addPlugin(seo, {
    title: "Dual.",
    description: "Docs & PWA turbocharged",
    url: "https://kodux78k.github.io/Dual./",
    author: "Kodux78k"
  });
  eleventyConfig.addPlugin(critical, {
    inline: true,
    dimensions: [{ width: 320, height: 480 }, { width: 1280, height: 960 }]
  });
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://kodux78k.github.io/Dual./"
    }
  });
  eleventyConfig.addPlugin(rss);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // 3) Image shortcode
  eleventyConfig.addNunjucksAsyncShortcode("image", async (src, alt, sizes="100vw") => {
    let metadata = await Image(src, {
      widths: [300, 600, 1200],
      formats: ["webp","jpeg"],
      outputDir: "./docs/_site/assets/img/",
      urlPath: "/assets/img/"
    });
    let lowsrc = metadata.jpeg[0];
    return `<picture>
      ${Object.values(metadata).map(fmt => 
        `<source type="${fmt[0].sourceType}" 
          srcset="${fmt.map(item=>item.srcset).join(", ")}" 
          sizes="${sizes}">`).join("\n")}
      <img 
        src="${lowsrc.url}" 
        width="${lowsrc.width}" 
        height="${lowsrc.height}" 
        alt="${alt}" 
        loading="lazy" 
        decoding="async">
    </picture>`;
  });

  // 4) HTML minify transform
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if(outputPath && outputPath.endsWith(".html")) {
      const minify = require("html-minifier-terser").minify;
      return minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      });
    }
    return content;
  });

  return {
    dir: {
      input: "docs/pages",
      layouts: "../layouts",
      output: "docs/_site"
    },
    templateFormats: ["html","md","njk"]
  };
};
