import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.generateInterface', async () => {
		const textEditor = vscode.window.activeTextEditor;

		if (!textEditor) {
			vscode.window.showErrorMessage('Failed to generated interface for selected class');
			return;
		}

		const selectedCode = textEditor.document.getText(textEditor.selection);
		// TODO do magic with selected code

		console.log(selectedCode);

		vscode.window.showInformationMessage('Successfully generated interface!', selectedCode);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	// TODO
}
