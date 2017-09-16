'use strict';
import * as vscode from 'vscode';
import { TextLine, TextEditor, commands, window, ExtensionContext, Range, Position, StatusBarItem, StatusBarAlignment, TextDocument, Disposable, DiagnosticSeverity, Diagnostic, languages } from "vscode";
import { refactor } from './refactor';
import { getDiagnostics } from './diagnostics';
import { alObject } from './alobject';

export function activate(context: ExtensionContext) {

    console.log('The NAV-Skills Clean Code Extension is loaded...');
    
    let maintainabilityIndex = new MaintainabilityIndex();
    let controller = new MaintainabilityIndexController(maintainabilityIndex);

    context.subscriptions.push(controller);
    context.subscriptions.push(maintainabilityIndex);
   
    let refactordisp = commands.registerCommand('Refactor', () => {
        refactor(window.activeTextEditor);
    })
    let ccodedisp = commands.registerCommand('CleanCode', () => {
  //      ccode.CleanCode(window.activeTextEditor);
  //      maintainabilityIndex.updateMaintainabilityIndex();
    })
    context.subscriptions.push(maintainabilityIndex);
    context.subscriptions.push(refactordisp);
    context.subscriptions.push(ccodedisp);
}

export function deactivate() {
}

class MaintainabilityIndex {
    
    private _statusBarItem: StatusBarItem;

    public updateMaintainabilityIndex() {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;
        
        // Only update status if an Markdown file
        if (doc.languageId === "al") {
            let myObject = new alObject(editor);
            getDiagnostics(editor, myObject);
        
            let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));
            
            if (config.statusbar) {
                let maintainabilityIndex = myObject.getMaintainabilityIndex(editor.document.lineAt(editor.selection.active.line));
                let cyclomaticComplexity = myObject.getCyclomaticComplexity(editor.document.lineAt(editor.selection.active.line));
                var currentFunctionName : string = myObject.getCurrentFunction(editor.document.lineAt(editor.selection.active.line));

                var theText = currentFunctionName + ` - Maintainability Index : ${maintainabilityIndex}` + ` Cyclomatic Complexity : ${cyclomaticComplexity}`;
                // Update the status bar
                this._statusBarItem.text = maintainabilityIndex !== 1 ? theText : 'Maintainability Index Undefined';
                if (maintainabilityIndex >= 20) {
                    this._statusBarItem.color = 'lightgreen';
                }
                else if (maintainabilityIndex >= 10) {
                    this._statusBarItem.color = 'orange';
                }
                else if (maintainabilityIndex != 0) {
                    this._statusBarItem.color = 'red'; 
                }           
                this._statusBarItem.show();
            }
        } else { 
            this._statusBarItem.hide();
        }
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

class MaintainabilityIndexController {

    private _maintainabilityIndex: MaintainabilityIndex;
    private _disposable: Disposable;

    constructor(theIndex: MaintainabilityIndex) {
        this._maintainabilityIndex = theIndex;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // update the counter for the current file
        this._maintainabilityIndex.updateMaintainabilityIndex();

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._maintainabilityIndex.updateMaintainabilityIndex();
    }
}

