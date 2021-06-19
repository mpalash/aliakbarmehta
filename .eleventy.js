const { DateTime } = require("luxon");
const _ = require("lodash");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const slugify = require("slugify");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItImplicitFigures = require('markdown-it-implicit-figures');
const markdownItFigureCaption = require('markdown-it-figure-caption');
const markdownItDeflist = require('markdown-it-deflist');
const markdownItRegex = require('markdown-it-regex')
const markdownItRegexp = require('markdown-it-regexp')

module.exports = function(eleventyConfig) {

  // Eleventy Navigation https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
  // layout aliases! Say you have a bunch of existing content using
  // layout: post. If you don’t want to rewrite all of those values, just map
  // post to a new file like this:
  // eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

  // Merge data instead of overriding
  // https://www.11ty.dev/docs/data-deep-merge/
  eleventyConfig.setDataDeepMerge(true);

  // Date formatting (year only) November 24, 2016 12:00 AM
  eleventyConfig.addFilter("yy", dateObj => {
    if(dateObj.length > 4) {
      return DateTime.fromFormat(dateObj,'MMMM d, yyyy h:mm a').toFormat("yyyy");
    } else {
      return dateObj
    }
  });

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  // Date formatting (ISO)
  eleventyConfig.addFilter("ISODate", dateObj => {
    return DateTime.fromMillis(Date.parse(dateObj)).toISO();
  });

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify JS
  eleventyConfig.addFilter("jsmin", function(code) {
    let minified = UglifyJS.minify(code);
    if (minified.error) {
      console.log("UglifyJS error: ", minified.error);
      return code;
    }
    return minified.code;
  });

  // Markdownify
  eleventyConfig.addFilter("md", value => {
    var md = new markdownIt({
      html: true,
      breaks: true,
      linkify: true
    }).use(markdownItImplicitFigures, {
      figcaption: true
    });
    // var valueMD = String(value).replace(/\/img\/.*.(?:jpe?g|gif|png)/g, function(match){
    //   return match.replace(/\s/g,'%20').replace(/\/img\//g,'/img-d/')
    // });
    var rendered = md.render(String(value));
    return rendered;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath.indexOf(".html") > -1) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Universal slug filter strips unsafe chars from URLs
  eleventyConfig.addFilter("slugify", function(str) {
    return slugify(str, {
      lower: true,
      replacement: "-",
      remove: /[*+~.·,()'"`´%!?¿:@!"#$%&'()*+,.\/:;<=≠>?@\\^``{|}~]/g
    });
  });

  // only content in the `pages/` directory
  eleventyConfig.addCollection('pages', function(collection) {
    return collection.getAllSorted().filter(function(item) {
      return item.inputPath.match(/^\.\/pages\//) !== null;
    });
  });
  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');

  // only content in the `content/` directory
  eleventyConfig.addCollection('content', function(collection) {
    return collection.getAll().sort(function(a, b){return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)}).filter(function(item) {
      return item.inputPath.match(/^\.\/content\//) !== null;
    });
  });
  eleventyConfig.addLayoutAlias('content', 'layouts/content.njk');

  // filtered content
  // projects = ['ongoing project','past project','artwork','video']
  // curatorial = ['curatorial']
  // exhibitions = ['solo exhibition','group exhibition','residency']
  // talks = ['talk']
  // performances = ['performance']
  // texts = ['publication','unpublished']
  // about = ['press','resource','text']

  eleventyConfig.addCollection('projects',
  collection => collection
    .getAll()
    .filter(function(item){
      const tagsList = ['ongoing project','past project','artwork','video'];
      const tags = item.data.tags;
      return _.intersection(tags, tagsList).length > 0 && item.data.unlisted != "true";
    })
    .sort(function(a, b){
      return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)
    })
    .reverse()
  )
  eleventyConfig.addCollection('curatorial',
  collection => collection
    .getAll()
    .filter(function(item){
      const tagsList = ['curatorial work'];
      const tags = item.data.tags;
      return _.intersection(tags, tagsList).length > 0 && item.data.unlisted != "true";
    })
    .sort(function(a, b){
      return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)
    })
    .reverse()
  )
  eleventyConfig.addCollection('exhibitions',
  collection => collection
    .getAll()
    .filter(function(item){
      const tagsList = ['solo exhibition','group exhibition','residency'];
      const tags = item.data.tags;
      return _.intersection(tags, tagsList).length > 0 && item.data.unlisted != "true";
    })
    .sort(function(a, b){
      return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)
    })
    .reverse()
  )
  eleventyConfig.addCollection('talks',
  collection => collection
    .getAll()
    .filter(function(item){
      const tagsList = ['artist talk','teaching'];
      const tags = item.data.tags;
      return _.intersection(tags, tagsList).length > 0 && item.data.unlisted != "true";
    })
    .sort(function(a, b){
      return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)
    })
    .reverse()
  )
  eleventyConfig.addCollection('performances',
  collection => collection
    .getAll()
    .filter(function(item){
      const tagsList = ['performance'];
      const tags = item.data.tags;
      return _.intersection(tags, tagsList).length > 0 && item.data.unlisted != "true";
    })
    .sort(function(a, b){
      return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)
    })
    .reverse()
  )
  eleventyConfig.addCollection('texts',
  collection => collection
    .getAll()
    .filter(function(item){
      const tagsList = ['publication','unpublished'];
      const tags = item.data.tags;
      return _.intersection(tags, tagsList).length > 0 && item.data.unlisted != "true";
    })
    .sort(function(a, b){
      return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)
    })
    .reverse()
  )
  eleventyConfig.addCollection('about',
  collection => collection
    .getAll()
    .filter(function(item){
      const tagsList = ['press','resource','text'];
      const tags = item.data.tags;
      return _.intersection(tags, tagsList).length > 0 && item.data.unlisted != "true";
    })
    .sort(function(a, b){
      return Date.parse(a.data.pubdate) - Date.parse(b.data.pubdate)
    })
    .reverse()
  )

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("static/");
  eleventyConfig.addPassthroughCopy("admin/");

  /* Markdown Plugins */
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: false
  };
  let figopts = {
    dataType: false,
    figcaption: true,
    tabindex: false,
    link: false
  };
  let regexp = markdownItRegexp(/\/img\/.*.(?:jpe?g|gif|png)/,function(match, utils) {
    let transformed = match.replace(/\s/g,'%20').replace(/\/img\//g,'/img-d/');
    return transformed;
  });
  let regex = {
    name: 'spacefix',
    regex: /\/img\/.*.(?:jpe?g|gif|png)/,
    replace: (match) => {
      return match.replace(/\s/g,'%20').replace(/\/img\//g,'/img-d/')
    }
  };

  eleventyConfig.setLibrary("md", markdownIt(options)
    // .use(markdownItRegex, regex)
    .use(regexp)
    .use(markdownItAnchor, opts)
    .use(markdownItImplicitFigures, figopts)
    .use(markdownItDeflist)
  );

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
