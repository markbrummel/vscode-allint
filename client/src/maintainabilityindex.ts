'use strict';
import * as vscode from 'vscode';
import { window, StatusBarItem, StatusBarAlignment } from "vscode";
import { alObject } from './alobject';


export class MaintainabilityIndex {

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

            let config = Object.assign({}, vscode.workspace.getConfiguration('allint'));

            if (config.statusbar) {
                let maintainabilityIndex = myObject.getMaintainabilityIndex(editor.document.lineAt(editor.selection.active.line));
                let cyclomaticComplexity = myObject.getCyclomaticComplexity(editor.document.lineAt(editor.selection.active.line));
                var currentFunctionName: string = myObject.getCurrentFunction(editor.document.lineAt(editor.selection.active.line));

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