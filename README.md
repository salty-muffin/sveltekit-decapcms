# sveltekit-netlifycms

a base repo for a static site with netlifycms & sharp image optimization.

it includes a component for rendering the markdown to html with a custom image component. the image component gets a range of options (an array of sizes, formats, quality, etc.). each page that uses netlifycms for content needs an endpoint in which the markdown is processed.

look to `src/routes/post/[slug]/+page.server.ts` to see how to set up an endpoint and to `src/routes/post/[slug]/+page.svelte` to see how to set up the corresponding page. look to `src/lib/types.ts` to get information about the image options.

for a inspirations on how to set up netlifycms look to `static/admin/config.yml`

## to do

- [x] add image component
- [x] add rich text processing
