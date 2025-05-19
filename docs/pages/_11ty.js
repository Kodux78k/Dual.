module.exports = function(eleventyConfig) {
  eleventyConfig.addCollection("searchIndex", collection =>
    collection.getAll().map(page => ({
      url: page.url,
      title: page.data.title,
      content: page.templateContent
    }))
  );
};
