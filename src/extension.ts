import * as vscode from 'vscode';
import { constructInterface } from './constructor';
import { parseClassDeclarations } from './parseClassDeclarations';

export async function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.generateInterface', async () => {
		const textEditor = vscode.window.activeTextEditor;

		if (!textEditor) {
			vscode.window.showErrorMessage('Failed to generated interface for selected class 😢');
			return;
		}

		const { selection, document } = textEditor;

		const classDeclarations = await parseClassDeclarations(document.getText(selection));
		const interfaces = classDeclarations.map(constructInterface);
		const insertion = insertInterfaces(interfaces, textEditor);

		vscode.window.showInformationMessage('Successfully generated interface 🙌');

		return vscode.workspace.applyEdit(insertion);
	});

	context.subscriptions.push(disposable);
}

function insertInterfaces(tsinterface: string[], textEditor: vscode.TextEditor) {
	const { document, selection } = textEditor;
	const insertionLine = document.lineAt(selection.start.line);
	const workspaceEdit = new vscode.WorkspaceEdit();
	workspaceEdit.insert(document.uri, insertionLine.range.start, `${tsinterface.join('\n')} \n`);
	return workspaceEdit;
}

export function deactivate() {
	// TODO
}
