const { DateTime } = require("luxon");
const _ = require("lodash");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const htmlmin = require("html-minifier");
const slugify = require("slugify");
const path = require("path");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItImplicitFigures = require('markdown-it-implicit-figures');
const markdownItFigureCaption = require('markdown-it-figure-caption');
const markdownItDeflist = require('markdown-it-deflist');
const markdownItRegexp = require('markdown-it-regexp');
const markdownItR = require('markdown-it-replace-it');

const Image = require('@11ty/eleventy-img');
const { parseHTML } = require('linkedom');

async function imageShortcode(src, alt, sizes) {
  const srcURL = '.' + src.replace(/\%20/g,' ')
  let metadata = await Image(srcURL, {
    widths: [800, 1000, 1200, 1600],
    formats: ["webp", "jpeg"],
    urlPath: "/images/",
    outputDir: "./_site/images/"
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}
function myImageShortcode(src, alt, sizes) {
  let options = {
    widths: [800, 1000, 1200, 1600],
    formats: ["webp","jpeg"],
    urlPath: "/images/",
    outputDir: "./_site/images/"
  };

  const srcURL = '.' + src.replace(/\%20/g,' ')

  // generate images, while this is async we don’t wait
  Image(srcURL, options);

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };
  // get metadata even the images are not fully generated
  let metadata = Image.statsSync(srcURL, options);
  return Image.generateHTML(metadata, imageAttributes);
}

function eleventyImg(content){
  let { document } = parseHTML(content)

  const options = {
    widths: [800, 1000, 1200, 1600],
    sizes: '800w, 1000w, 1200w, 1600w', // your responsive sizes here
    formats: ['webp', 'jpeg'],
    urlPath: '/images/',
    outputDir: './_site/images/',
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension).replace(/\s/g,'-');
      return `${name}-${width}w.${format}`;
    }
  }

  const images = [...document.querySelectorAll('img')]

  images.forEach((i, index) => {
    const src = '.' + i.getAttribute('src').replace(/\%20/g,' ')
    const alt = i.getAttribute('alt')

    const meta = Image.statsSync(src, options)
    const last = meta.jpeg[meta.jpeg.length - 1]
    if (last.width < 500) return

    Image(src, options)
    i.setAttribute('width', last.width)
    i.setAttribute('height', last.height)
    i.setAttribute('alt', alt)
    if (index !== 0) {
      i.setAttribute('loading', 'lazy')
      i.setAttribute('decoding', 'async')
    }

    i.outerHTML = `
    <picture>
      <source type="image/webp" alt="${i.alt}" loading="lazy" srcset="${meta.webp.map(p => p.srcset).join(', ')}" onload="this.classList.add('imgLoaded')">
      <source type="image/jpeg" alt="${i.alt}" loading="lazy" srcset="${meta.jpeg.map(p => p.srcset).join(', ')}" onload="this.classList.add('imgLoaded')">
      <img alt="${i.alt}" loading="lazy" srcset="${meta.jpeg.map(p => p.srcset).join(', ')}" onload="this.classList.add('imgLoaded')">
      <span>${i.alt}</span>
    </picture>`
  })

  return `${document.documentElement.outerHTML}`
}

module.exports = eleventyConfig => {

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

  // Nunjucks image shortcode
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addNunjucksShortcode("myImage", myImageShortcode);

  // OG Hero image
  eleventyConfig.addFilter("og", src => {
    const extension = path.extname(src);
    const name = path.basename(src, extension).replace(/\s/g,'-');
    const folder = '/images/';
    const width = 1600;
    const format = 'jpeg';
    return `${folder}${name}-${width}w.${format}`;
  });
  // Thumb image
  eleventyConfig.addFilter("thumb", src => {
    const extension = path.extname(src);
    const name = path.basename(src, extension).replace(/\s/g,'-');
    const folder = '/images/';
    const width = 800;
    const format = 'jpeg';
    return `${folder}${name}-${width}w.${format}`;
  });

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

  // Universal slug filter strips unsafe chars from URLs
  eleventyConfig.addFilter("slugify", function(str) {
    return slugify(str.toString(), {
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

  /* Markdown Plugins */
  let options = {
    html: true,
    breaks: false,
    linkify: true,
    typographer: true
  };
  let anchoropts = {
    permalink: false
  };
  let figopts = {
    dataType: false,
    figcaption: true,
    tabindex: false,
    link: false
  };
  // This works
  // markdownItR.replacements.push({
  //   name: 'pathfix',
  //   re: /\/img\/.*.(?:jpe?g|gif|png)/g,
  //   sub: function (s) {
  //     // let t = s.replace(/img/g,'img-d');
  //     let u = s.replace(/\s/g,'%20');
  //     return u;
  //   },
  //   default: true
  // });
  // let regexp = markdownItRegexp(
  //   /\/img\/.*.(?:jpe?g|gif|png)/,
  //   function(match, utils) {
  //     let transformed = match.replace(/\s/g,'%20');
  //     return transformed;
  //   }
  // );

  let markdownLib = markdownIt(options).use(markdownItAnchor, anchoropts).use(markdownItDeflist);

  markdownLib.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    let imgSrc = '.' + token.attrGet('src').replace(/\%20/g,' ')
    const imgAlt = token.content
    const imgTitle = token.attrGet('title')

    const htmlOpts = {
      title: imgTitle,
      alt: imgAlt,
      loading: 'lazy',
      decoding: 'async'
    }

    const imgOpts = {
      widths: [800, 1000, 1200, 1600],
      sizes: '800w, 1000w, 1200w, 1600w', // your responsive sizes here
      formats: ['webp', 'jpeg'],
      urlPath: '/images/',
      outputDir: './_site/images/',
      filenameFormat: function (id, src, width, format, options) {
        const extension = path.extname(src);
        const name = path.basename(src, extension).replace(/\s/g,'-');
        return `${name}-${width}w.${format}`;
      }
    }

    const meta = Image.statsSync(imgSrc, imgOpts)

    Image(imgSrc, imgOpts)

    // const generated = Image.generateHTML(meta, {
    //   sizes: imgOpts.sizes,
    //   ...htmlOpts
    // })

    let generated = `
     <picture>
      <source type="image/webp" alt="${imgAlt}" loading="lazy" srcset="${meta.webp.map(p => p.srcset).join(', ')}" onload="this.classList.add('imgLoaded')">
      <source type="image/jpeg" alt="${imgAlt}" loading="lazy" srcset="${meta.jpeg.map(p => p.srcset).join(', ')}" onload="this.classList.add('imgLoaded')">
      <img alt="${imgAlt}" loading="lazy" srcset="${meta.jpeg.map(p => p.srcset).join(', ')}" onload="this.classList.add('imgLoaded')">
      <span>${imgAlt}</span>
    </picture>`

    return generated
  }



  // Markdownify
  eleventyConfig.addFilter("md", value => {
    // var md = new markdownIt({
    //   html: true,
    //   breaks: true,
    //   linkify: true
    // })
    // .use(markdownItImplicitFigures, {
    //   figcaption: true
    // });
    var valueMD = String(value).replace(/\/img\/.*.(?:jpe?g|gif|png)/g, function(match){
      return match.replace(/\s/g,'%20');
    });
    var rendered = markdownLib.render(valueMD); //renderInline breaks things
    // return eleventyImg(rendered);
    return rendered;
  });
  eleventyConfig.setLibrary("md", markdownLib);

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (this.outputPath && this.outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // eleventyConfig.addTransform('transform', (content, outputPath) => {
  //   if (this.outputPath && this.outputPath.endsWith(".html")) {
  //     let { document } = parseHTML(content)
  //
  //     const options = {
  //       widths: [800, 1000, 1200, 1800],
  //       sizes: '800w, 1000w, 1200w, 1800w', // your responsive sizes here
  //       formats: ['webp', 'jpeg'],
  //       urlPath: '/img/',
  //       outputDir: './_site/images/'
  //     }
  //
  //     const images = [...document.querySelectorAll('main img')]
  //
  //     images.forEach((i, index) => {
  //       const src = '.' + i.getAttribute('src')
  //
  //       const meta = Image.statsSync(src, options)
  //       const last = meta.jpeg[meta.jpeg.length - 1]
  //       if (last.width < 500) return
  //
  //       Image(src, options)
  //       i.setAttribute('width', last.width)
  //       i.setAttribute('height', last.height)
  //       if (index !== 0) {
  //         i.setAttribute('loading', 'lazy')
  //         i.setAttribute('decoding', 'async')
  //       }
  //
  //       i.outerHTML = `
  //       <picture>
  //         <source type="image/webp" sizes="${options.sizes}" srcset="${meta.webp.map(p => p.srcset).join(', ')}">
  //         <source type="image/jpeg" sizes="${options.sizes}" srcset="${meta.jpeg.map(p => p.srcset).join(', ')}">
  //         ${i.outerHTML}
  //       </picture>`
  //     })
  //
  //     return `<!DOCTYPE html>${document.documentElement.outerHTML}`
  //   }
  //   return content
  // })

  // Don't process folders with static assets e.g. images
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("static/");
  eleventyConfig.addPassthroughCopy("admin/");

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
