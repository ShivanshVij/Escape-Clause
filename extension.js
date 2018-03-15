// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    let Clause = new escapeClause();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.escapeClause', () => {
        // The code you place here will be executed every time your command is executed

        Clause.escape();

        // Display a message box to the user
        vscode.window.showInformationMessage('Escaped.');
    });
    context.subscriptions.push(Clause);
    context.subscriptions.push(disposable);
}
class escapeClause {
    escape(){
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No text editor open.");
            return;
        }
        const position = editor.selection.active;
        var startofline = position.with(position.line, 0); //Moves position to the start of the line
        var endofline = position.with(position.line, 99999999999); //Moves position to the end of the line
        var newSelection = new vscode.Selection(startofline, endofline);
        editor.selection = newSelection;
        var selectedtext = editor.document.getText(newSelection);
        var toADD = function adder(TEXT){
            var toAdd = "";
            var NF = 0; //Normal Bracket found
            var SF = 0; //Square Bracket found
            var CF = 0; //Curly Bracket found
            for(var i = TEXT.length-1; i >= 0; i--){
                if(TEXT[i] == ')'){
                    NF++;
                }
                if(TEXT[i] == ']'){
                    SF++;
                }
                if(TEXT[i] == '}'){
                    CF++;
                }
                
                if(TEXT[i] == '('){
                    if(NF > 0){
                        NF--;
                    }
                    else{
                        toAdd += ')';
                    }
                }
                if(TEXT[i] == '['){
                    if(SF > 0){
                        SF--;
                    }
                    else{
                        toAdd += ']';
                    }
                }
                if(TEXT[i] == '{'){
                    if(CF > 0){
                        CF--;
                    }
                    else{
                        toAdd += '}';
                    }
                }
                if(i == 0){
                    if(CF != 0 || NF != 0 || SF != 0){
                        vscode.window.showWarningMessage("We detected that you have an incorrect bracket in your line.");
                    }
                    return toAdd;
                }
            }
            return toAdd;
        }
        var replace = selectedtext + toADD(selectedtext);
        vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(startofline, endofline), replace);
        });
        var clearSelection = new vscode.Selection(endofline, endofline);
        editor.selection = clearSelection;
        return;
     }
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;