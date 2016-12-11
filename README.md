# Not maintained any more

For a more up-to-date version of this extension that also has more features (and that can be installed from the MarketPlace), please refer to [this fork](https://github.com/joffreykern/vscode-markdown-toc) by Joffrey Kern.

# Markdown TOC

A [Visual Studio Code](https://code.visualstudio.com/) extension that generates a table of contents for your markdown file. Steps:

## Installation

See [here](https://code.visualstudio.com/docs/extensions/install-extension) for instructions on how to install an extension using the source. I am working on providing a package (`.vsix`) file.

Currently I do not have any plans of publishing the extension to the [MarketPlace](https://code.visualstudio.com/docs/editor/extension-gallery). This is because doing so requires me to go through a lengthy registration process. I may revisit this decision some day.  


## Usage

  - Open any markdown file
  - Open the command palette (`Ctrl+Shift+P` on Linux)
  - Type "Generate"
  - Choose "Generate TOC for markdown"
  - Select the number of heading levels to be included in the TOC

  
## Known issues
  
  1. Special characters in the Headings get included in the generated link.
  2. You need to delete existing TOC each time before generating it.  
