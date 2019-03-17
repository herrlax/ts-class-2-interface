import * as vscode from "vscode";
import { constructInterface, IConstructedInterface } from "./constructor";
import {
  getDeclarations,
  getSignatureLength,
  createSignatureSuffix
} from "./parser";
import { ClassDeclaration } from "typescript-parser";

export async function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.generateInterface",
    async () => {
      const textEditor = vscode.window.activeTextEditor;

      if (!textEditor) {
        error("Failed for some unknown reason 😢");
        return;
      }

      const { selection, document } = textEditor;
      const classDeclarations = await getDeclarations(
        document.getText(selection).trim()
      );

      if (classDeclarations.length === 0) {
        error("Found no selected class 💁‍");
        return;
      }

      if (!(classDeclarations[0] instanceof ClassDeclaration)) {
        error("Please select only a class");
        return;
      }

      if (classDeclarations.length > 1) {
        error(
          "Currently, we only support 1 selected class at a time. Sorry 🙇‍"
        );
        return;
      }

      const tsinterface = constructInterface(
        classDeclarations[0] as ClassDeclaration
      );

      insertInterface(tsinterface, textEditor);

      vscode.window.showInformationMessage(
        "Successfully generated interface from selected class 🙌"
      );
    }
  );

  context.subscriptions.push(disposable);
}

function insertInterface(
  tsinterface: IConstructedInterface,
  textEditor: vscode.TextEditor
) {
  const { document, selection } = textEditor;

  const signatureLength = getSignatureLength(document.getText(selection));
  const signatureSufix = createSignatureSuffix(
    document
      .getText(selection)
      .trim()
      .split("\n")[0],
    tsinterface.name
  );

  textEditor.edit(builder => {
    const selectedClass = textEditor.selection.start;
    const location = new vscode.Position(
      selectedClass.line,
      signatureLength - 2
    );

    builder.insert(selectedClass, `${tsinterface.value}\n`);
    builder.insert(location, signatureSufix);
  });
}

function error(message: string) {
  vscode.window.showErrorMessage(message);
}

export function deactivate() {
  // TODO
}
