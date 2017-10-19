'use strict';
import {
	IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocuments, TextDocument,
	Diagnostic, InitializeResult
} from 'vscode-languageserver';
import { alObject } from './alobject';
import { checkForCommit, checkForWithInTableAndPage, checkFunctionReservedWord, checkFunctionForHungarianNotation, checkFieldForHungarianNotation, checkVariableForHungarianNotation, checkVariableForIntegerDeclaration, checkVariableForTemporary, checkVariableForTextConst, checkVariableForReservedWords, checkVariableAlreadyUsed, checkVariableNameForUnderScore, checkForMissingDrillDownPageId, checkForMissingLookupPageId } from './diagnostics';

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites. 
let workspaceRoot: string;
connection.onInitialize((params): InitializeResult => {
	workspaceRoot = params.rootPath;
	return {
		capabilities: {
			// Tell the client that the server works in FULL text document sync mode
			textDocumentSync: documents.syncKind
			// Tell the client that the server support code complete
			// completionProvider: {
			// 	resolveProvider: true
			// }
			//codeActionProvider: true
		}
	}
});


// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
	validateAlDocument(change.document);
});

// The settings interface describe the server relevant settings part
interface Settings {
	allint: AlLintSettings;
}

// These are the settings we defined in the client's package.json file
interface AlLintSettings {
	enabled: boolean;
	statusbar: boolean;
	checkcommit: boolean;
	checkhungariannotation: boolean;
	checkspecialcharactersinvariablenames: boolean;
	hungariannotationoptions: string;
	checkdrilldownpageid: boolean;
	checklookuppageid: boolean;
}

let enabled: boolean;
let statusbar: boolean;
let checkcommit: boolean;
let checkhungariannotation: boolean;
let checkspecialcharactersinvariablenames: boolean;
let hungariannotationoptions: string;
let checkdrilldownpageid: boolean;
let checklookuppageid: boolean;

// The settings have changed. Is send on server activation
// as well.
connection.onDidChangeConfiguration((change) => {
	let settings = <Settings>change.settings;
	enabled = settings.allint.enabled;
	statusbar = settings.allint.statusbar;
	checkcommit = settings.allint.checkcommit;
	checkhungariannotation = settings.allint.checkhungariannotation;
	checkspecialcharactersinvariablenames = settings.allint.checkspecialcharactersinvariablenames;
	hungariannotationoptions = settings.allint.hungariannotationoptions;
	checkdrilldownpageid = settings.allint.checkdrilldownpageid;
	checklookuppageid = settings.allint.checklookuppageid;
	// Revalidate any open text documents
	documents.all().forEach(validateAlDocument);
});

function validateAlDocument(alDocument: TextDocument): void {
	let diagnostics: Diagnostic[] = [];
	if (!enabled) {
		connection.sendDiagnostics({ uri: alDocument.uri, diagnostics });
		return;
	}
	let lines = alDocument.getText().split(/\r?\n/g);
	let myObject = new alObject(alDocument.getText(), hungariannotationoptions);
	if (checkdrilldownpageid)
		checkForMissingDrillDownPageId(diagnostics, myObject);
	if (checklookuppageid)
		checkForMissingLookupPageId(diagnostics, myObject);
	lines.forEach((line, i) => {

		if (myObject.alLine[i].isCode) {
			if (checkcommit)
				checkForCommit(line.toUpperCase(), diagnostics, i);
			checkForWithInTableAndPage(line.toUpperCase(), diagnostics, myObject, i);
		}


		myObject.alFunction.forEach(alFunction => {
			if (alFunction.startsAtLineNo == i + 1) {
				if (checkhungariannotation)
					checkFunctionForHungarianNotation(alFunction, line, diagnostics, i);
				checkFunctionReservedWord(alFunction, line, diagnostics, i);
			}
		});
		myObject.alField.forEach(alField => {
			if (alField.lineNumber == i + 1) {
				if (checkhungariannotation)
					checkFieldForHungarianNotation(alField, line, diagnostics, i);
			}
		});

		myObject.alVariable.forEach(alVariable => {
			if (alVariable.lineNumber == i + 1) {
				if (checkhungariannotation)
					checkVariableForHungarianNotation(alVariable, line, diagnostics, i);
				checkVariableForIntegerDeclaration(alVariable, line, diagnostics, i);
				checkVariableForTemporary(alVariable, line, diagnostics, i);
				checkVariableForTextConst(alVariable, line, diagnostics, i);
				checkVariableForReservedWords(alVariable, line, diagnostics, i);
				//checkVariableUnUsed(alVariable, line, diagnostics, i);
				checkVariableAlreadyUsed(myObject, alVariable, line, diagnostics, i);
				if (checkspecialcharactersinvariablenames)
					checkVariableNameForUnderScore(alVariable, line, diagnostics, i);
			}
		});
	})
	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: alDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles((_change) => {
	// Monitored files have change in VSCode
	connection.console.log('We recevied an file change event');
});


/*
connection.onDidOpenTextDocument((params) => {
	// A text document got opened in VSCode.
	// params.uri uniquely identifies the document. For documents store on disk this is a file URI.
	// params.text the initial full content of the document.
	connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
	// The content of a text document did change in VSCode.
	// params.uri uniquely identifies the document.
	// params.contentChanges describe the content changes to the document.
	connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
	// A text document got closed in VSCode.
	// params.uri uniquely identifies the document.
	connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Listen on the connection
connection.listen();
