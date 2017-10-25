'use strict';

import * as path from 'path';
import { commands, workspace, ExtensionContext, window } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import { MaintainabilityIndex } from './maintainabilityindex';
import { MaintainabilityIndexController } from './maintainabilityindexcontroller';
import { refactor } from './refactor';
import { handlerApplyTextEdits } from './commands';

export function activate(context: ExtensionContext) {

	console.log('The NAV-Skills Clean Code Extension is loaded...');
	
	// The server is implemented in node
	let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
	// The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}
	
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{scheme: 'file', language: 'al'}],
		synchronize: {
			// Synchronize the setting section 'languageServerExample' to the server
			configurationSection: 'allint',
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	}
	let server = new LanguageClient('allint', 'AL Language Server', serverOptions, clientOptions);
	// Create the language client and start the client.
	let disposable = server.start();
	context.subscriptions.push(commands.registerCommand('alLint.editText', handlerApplyTextEdits(server)));
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);

	let maintainabilityIndex = new MaintainabilityIndex();
    let controller = new MaintainabilityIndexController(maintainabilityIndex);
	context.subscriptions.push(maintainabilityIndex);
    context.subscriptions.push(controller);
	
	let refactordisp = commands.registerCommand('Refactor', () => {
        refactor(window.activeTextEditor);
	})
	context.subscriptions.push(refactordisp);

    let ccodedisp = commands.registerCommand('CleanCode', () => {
   // ccode.CleanCode(window.activeTextEditor);
   // maintainabilityIndex.updateMaintainabilityIndex();

    })
    context.subscriptions.push(ccodedisp);
}
