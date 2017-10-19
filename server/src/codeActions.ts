import { TextDocuments, Command, CodeActionParams, TextDocument } from 'vscode-languageserver';
import * as LangServer from 'vscode-languageserver';

function extractText(textDocument: TextDocument, range: LangServer.Range) {
    const { start, end } = range;
    const offStart = textDocument.offsetAt(start);
    const offEnd = textDocument.offsetAt(end);
    return textDocument.getText().slice(offStart, offEnd);
}

export function onCodeActionHandler(documents: TextDocuments) {

    return (params: CodeActionParams) => {
        const commands: Command[] = [];
        const { context, textDocument: { uri } } = params;
        const { diagnostics } = context;
        const textDocument = documents.get(uri);
        uri;
        documents;

        function replaceText(range: LangServer.Range, text: string) {
            return LangServer.TextEdit.replace(range, text || '');
        }
        const alLintDiags = diagnostics.filter(diag => (diag.source === 'AlLint' && diag.code === 'Rename'));
        for (const diag of alLintDiags) {
            const word = extractText(textDocument, diag.range);
            commands.push(LangServer.Command.create('Rename Variable', 'alLint.editText',
                uri,
                textDocument.version,
                [replaceText(diag.range, CleanupName(word))]
            ));
        }
        return commands;
    }
};

function CleanupName(value: string) {
    let r = /[_~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?\s]/;
    return value.replace(r, '');
}