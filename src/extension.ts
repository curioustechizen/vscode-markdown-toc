// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdown-toc" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.markdownToc', markdownTocOptions);
	
	context.subscriptions.push(disposable);
}

function markdownTocOptions() {
  var opts: vscode.QuickPickOptions = {matchOnDescription: true, placeHolder: "How many levels of headings do you want to include in the ToC?"}
  var items: vscode.QuickPickItem[] = [];

	items.push({ label: "1", description: "Only include Level 1 headings" });
	items.push({ label: "2", description: "Include Level 1 and Level 2 headings" });
	items.push({ label: "3", description: "Include Level 1, 2 and 3 headings" });
  
  vscode.window.showQuickPick(items).then((selection) => {
    generateToc(parseInt(selection.label, 10));
  });
}

function generateToc(numberOfLevels: number) {
  new TocGenerator(numberOfLevels).process();
}

export class TocGenerator {
  private _toc: string = "";
  constructor(private numberOfLevels: number){}
  process() {
    let editor = vscode.window.activeTextEditor;
    let doc = editor.document;
    let numLines = doc.lineCount;
    var insideTripleBacktickCodeBlock: boolean = false;
    for (var lineNumber = 0; lineNumber < numLines; lineNumber++) {
      let aLine = doc.lineAt(lineNumber);
      
      //Ignore empty lines
      if(aLine.isEmptyOrWhitespace) continue;
      
      //Ignore pre-formatted code blocks in the markdown
      if(aLine.firstNonWhitespaceCharacterIndex > 3) continue;
      
      let lineText = aLine.text.trim();
      
      //If we are within a triple-backtick code blocks, then ignore
      if(lineText.startsWith("```")) {
        if(insideTripleBacktickCodeBlock) continue;
        insideTripleBacktickCodeBlock = !insideTripleBacktickCodeBlock;
      } 
      if(lineText.startsWith("#")) {
        this._processPotentialHeading(lineText);
      }
    }
    this._toc = this._toc.concat("\n\n");
    editor.edit((editBuilder: vscode.TextEditorEdit)=>{
      editBuilder.insert(new vscode.Position(0,0), this._toc);
      return Promise.resolve();
    });
    doc.save();
  }
  
  private _processPotentialHeading(lineText: string) {
    let headingSeparatorLocation = lineText.indexOf(" ");
    //let splitHeading = lineText.split(" ");
    let headingDenoter = lineText.substr(0, headingSeparatorLocation);
    if(headingDenoter.length <= this.numberOfLevels) {
      let significantHeadingText = lineText.substring(headingSeparatorLocation+1);
      this._toc = this._toc.concat(this._generateTocLine(significantHeadingText, headingDenoter.length));
    }
    
  }
  
  private _generateTocLine(headingText: string, headingLevel: number): string {
    var tocLine = "\n";
    for (var i = 1; i < headingLevel; i++) {
      tocLine = tocLine.concat("  ");
    }
    tocLine = tocLine.concat("- [").concat(headingText).concat("](#").concat(this._headingTextToAnchor(headingText)).concat(")");
    return tocLine;
  }
  
  private _headingTextToAnchor(headingText: string): string {
    let splitHeading = headingText.split(" ");
    if(splitHeading.length == 0 || splitHeading.length == 1) return headingText.toLocaleLowerCase();
    let anchorString = "";
    for (var index = 0; index < splitHeading.length; index++) {
      anchorString = anchorString.concat(splitHeading[index].toLocaleLowerCase());
      if(index != splitHeading.length-1) anchorString = anchorString.concat("-");
    }
    return anchorString;
  }
  
}