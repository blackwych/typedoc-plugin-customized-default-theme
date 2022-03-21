@blackwych/typedoc-plugin-customized-default-theme
==================================================

TypeDoc plugin to customize TypeDoc's default theme


## Features

* Provides cascading customization of TypeDoc's default theme
* Finds functions with the certain names exported in the specified modules and invokes them at the corresponding timings
* Useful to apply multiple customization themes
  * If the theme plugins you want to use supports this plugin, just specify the plugin module paths to the config.
  * Otherwise, you can create and specify some modules exporting customization functions you want.


## Installation

```sh
npm install -D @blackwych/typedoc-plugin-customized-default-theme
```


## Usage

TypeDoc will automatically detect and enable this plugin.


To use this theme, configure `theme` and `themeCustomizers` options as command-line options
```sh
typedoc [any options and arguments] \
  --theme customized-default \
  --themeCustomizers /path/to/module1 \
  --themeCustomizers /path/to/module2
```
or in your `typedoc.js[on]`
```JSON
{
  "theme": "customized-default",
  "themeCustomizers": [
    "/path/to/module1",
    "/path/to/module2"
  ]
}
```


## Options

| Option             | Type       | Defaults | Description
|--------------------|------------|----------|--------------
| `themeCustomizers` | `string[]` | `[]`     | Module paths exporting customization functions


## Customization functions

Supporting customization functions are as follows:

| Function name         | Signature                                                                      | Description
|-----------------------|--------------------------------------------------------------------------------|-------------
| `onHeadBegin`         | `(...args: RendererHooks['head.begin']) => JSX.Element`                        | Invoked at the beginning of HEAD element in each page.<br>Corresponding to `head.begin` renderer hook.
| `onHeadEnd`           | `(...args: RendererHooks['head.end']) => JSX.Element`                          | Invoked at the end of HEAD element in each page.<br>Corresponding to `head.end` renderer hook.<br>Useful to insert custom stylesheets.
| `onHeadBegin`         | `(...args: RendererHooks['body.begin']) => JSX.Element`                        | Invoked at the beginning of BODY element in each page.<br>Corresponding to `body.begin` renderer hook.
| `onHeadEnd`           | `(...args: RendererHooks['body.end']) => JSX.Element`                          | Invoked at the end of BODY element in each page.<br>Corresponding to `body.end` renderer hook.<br>Useful to insert custom JavaScript.
| `onRendererBegin`     | `(event: RendererEvent) => void`                                               | Invoked at the beginning of whole rendering.<br>Corresponding to `Renderer.EVENT_BEGIN` event.
| `onRendererEnd`       | `(event: RendererEvent) => void`                                               | Invoked at the end of whole rendering.<br>Corresponding to `Renderer.EVENT_END` event.<br>Useful to output/copy custom images.
| `onRendererPageBegin` | `(event: PageEvent) => void`                                                   | Invoked at the beginning of rendering each page.<br>Corresponding to `Renderer.EVENT_PAGE_BEGIN` event.
| `onRendererPageEnd`   | `(event: PageEvent) => void`                                                   | Invoked at the end of rendering each page.<br>Corresponding to `Renderer.EVENT_PAGE_END` event.
| `decorateContext`     | `(ctor: typeof DefaultThemeRenderContext) => typeof DefaultThemeRenderContext` | Invoked when creating RenderContext.<br>Useful to customize rendering methods defined in RenderContext.

\*Not all functions are necessary.  
\*Type definitions are in TypeDoc's source.
