# 1 - Shaders Getting Started

*Day #1*

## [*The Book of Shaders* - Getting Start](book) Notes

- Final pixel color is assigned to the reserved global variable `gl_FragColor`

## [Atom](atom) Guide

*Recommended under offline working.*

### Install Necessary Packages

Add syntax highlighting, snippets, completion, and live previewer to GLSL shaders in the Atom editor.

``` bash
apm install language-glsl autocomplete-glsl glsl-preview
```

### Linting GLSL Shaders

Install `glslangValidator` and add linter to GLSL shaders in the Atom editor.

``` bash
brew install glslang
apm install linter linter-glsl
```

*Follow this [link](homebrew) if you haven't install Homebrew.*

[book]: https://thebookofshaders.com/01/
[atom]: https://atom.io
[homebrew]: https://brew.sh
