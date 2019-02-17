import * as vscode from 'vscode';
import { constructInterface, IConstructedInterface } from './constructor';
import { parseClassDeclarations } from './parseClassDeclarations';

export async function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.generateInterface', async () => {
		const textEditor = vscode.window.activeTextEditor;

		if (!textEditor) {
			error('Failed for some unknown reason 😢');
			return;
		}

		const { selection, document } = textEditor;
		const classDeclarations = await parseClassDeclarations(document.getText(selection).trim());

		if (classDeclarations.length === 0) {
			error('Found no selected class 💁‍');
			return;
		}

		if (classDeclarations.length > 1) {
			error('Currently, we only support 1 selected class at a time. Sorry 🙇‍');
			return;
		}

		const tsinterface = constructInterface(classDeclarations[0]);
		await insertInterfaces(tsinterface, textEditor);

		vscode.window.showInformationMessage('Successfully generated interface from selected class 🙌');
	});

	context.subscriptions.push(disposable);
}

async function insertInterfaces(tsinterface: IConstructedInterface, textEditor: vscode.TextEditor) {
	const { document, selection } = textEditor;

	const signatureLength = await getSignatureLength(document.getText(selection));
	const signatureSufix = await getSignatureSufix(tsinterface.name);

	textEditor.edit(builder => {
		const selectedClass = textEditor.selection.start;
		const location = new vscode.Position(selectedClass.line, signatureLength - 1);

		builder.insert(selectedClass, `${tsinterface.value}\n`);
		builder.insert(location, signatureSufix);
	});
}

async function getSignatureLength(code: string) {
	const lines = code.split('\n');
	return lines[0].trim().length;
}

async function getSignatureSufix(interfaceName: string) {
	return `implements ${interfaceName} `;
}

function error(message: string) {
	vscode.window.showErrorMessage(message);
}

export function deactivate() {
	// TODO
}
