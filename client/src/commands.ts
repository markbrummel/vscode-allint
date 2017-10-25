import { LanguageClient } from "vscode-languageclient/lib/main";
import { TextEdit, window } from "vscode";
import * as vscode from 'vscode';


export function handlerApplyTextEdits(client: LanguageClient) {
    return function applyTextEdits(uri: string, documentVersion: number, edits: TextEdit[]) {
        const textEditor = window.activeTextEditor;
        if (textEditor && textEditor.document.uri.toString() === uri) {
            if (textEditor.document.version !== documentVersion) {
                window.showInformationMessage(`Spelling changes are outdated and cannot be applied to the document.`);
            }
            client;
            for (const edit of edits) {
                vscode.commands.executeCommand<vscode.WorkspaceEdit>('vscode.executeDocumentRenameProvider',
                    vscode.window.activeTextEditor.document.uri,
                    new vscode.Position(edit.range.start.line, edit.range.start.character),
                    edit.newText).then(edit2 => {
                        if (!edit2) {
                            return false;
                        }
                        return vscode.workspace.applyEdit(edit2);
                    })
            }
        }
    };
}