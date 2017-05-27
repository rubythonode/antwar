---
title: "Configuration"
sort: 1
preview: "Understand configuration, understand Antwar"
---

Just like [webpack](https://webpack.js.org/), the heart of Antwar, also Antwar has been built on top of configuration.

`antwar.config.js` describes how to map your content into a site. It ties layouts to the content and allows you to define custom pages where needed. It's also the place where you maintain possible redirects and attach plugins to the system.

## Example

This is the configuration for this site. If you are used to working with JavaScript, most of this should look familiar.

```javascript
const _ = require('lodash');
const moment = require('moment');
const rssPlugin = require('antwar-rss-plugin');
const prevnextPlugin = require('antwar-prevnext-plugin');

module.exports = {
  template: {
    title: 'Antwar',
    rss: {
      title: 'Antwar',
      href: '/atom.xml'
    }
  },
  output: 'build',
  author: 'Antwar',
  layout: () => require('./layouts/SiteBody').default,
  plugins: [
    rssPlugin({
      baseUrl: 'https://antwar.js.org/',
      sections: ['blog'],
      get: {
        content: page => page.file.body,
        date: page => (
          moment(page.file.attributes.date).utcOffset(0).format()
        ),
        title: page => page.file.attributes.title
      }
    }),
    prevnextPlugin()
  ],
  paths: {
    '/': {
      content: () => (
        require.context(
          './loaders/page-loader!./pages',
          true,
          /^\.\/.*\.md$/
        )
      ),
      layout: () => require('./layouts/Page').default,
      index: () => require('./layouts/SiteIndex').default,
      paths: {
        blog: {
          layout: () => require('./layouts/BlogPage').default,
          index: () => require('./layouts/SectionIndex').default,
          sort: pages => _.sortBy(pages, 'date').reverse(),
          url: ({ sectionName, fileName }) => (
            `/${sectionName}/${_.trimStart(fileName, '0123456789-')}/`
          )
        },
        docs: {
          layout: () => require('./layouts/DocsPage').default,
          index: () => require('./layouts/SectionIndex').default,
          sort: pages => (
            _.sortBy(pages, page => page.file.attributes.sort)
          )
        }
      }
    }
  }
};
```