# osm-berlin.org website

osm-berlin.org is a project hub that documents the different activities of the OSM Berlin community.

Learn more…

- https://www.osm-berlin.org/
- https://wiki.openstreetmap.org/wiki/Berlin/Stammtisch
- Join our next "Stammtisch"

## Stammtisch

We have monthly meetups – usually in German. The next meetup will be announced [on our Wiki page](https://wiki.openstreetmap.org/wiki/Berlin/Stammtisch).

## Development

This project is build with [Astro](https://astro.build/), using `.astro` files whenever possible and Markdown or MDX for blog posts and pages. Dynamic pages like maps are build in React.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/blog)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/blog)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/blog/devcontainer.json)

### CMS

We use [Keystatic](https://keystatic.com/) to edit some of the content.

- [CMS-Website](https://osm-berlin-keystatic.netlify.app/keystatic) (Can only be used by users that have permissions to this Github repo)
- [Netlify-Backend for the CMS](https://app.netlify.com/sites/osm-berlin-keystatic/overview) (Managed by @tordans)

### Add a new project

- Create a new project folder in `/pages`
- Update the project slug in `pages/PROJECT/posts/[...slug].astro`
- Add the project slug to `content/config.ts`
- Add the project config to `projectConfigs.const.ts`
