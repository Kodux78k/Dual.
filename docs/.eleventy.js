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