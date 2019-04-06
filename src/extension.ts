import * as vscode from "vscode";
import {
  constructInterface,
  IConstructedInterface,
  createSignatureSuffix
} from "./constructor";
import { getDeclarations, getSignature, getInsertCol } from "./parser";
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

  const signature = getSignature(document.getText(selection));
  const signatureSufix = createSignatureSuffix(signature, tsinterface.name);
  const selectedClass = textEditor.selection.start;
  const insertCol = getInsertCol(signature);
  const insertPosition = getInserPosition(
    selectedClass.line,
    insertCol,
    document
  );

  if (!document.getWordRangeAtPosition(insertPosition)) {
    error("Found no selected class 💁‍");
    return;
  }

  textEditor.edit(builder => {
    builder.insert(selectedClass, `${tsinterface.value}\n`);
    builder.insert(insertPosition, signatureSufix);
  });
}

function getInserPosition(
  line: number,
  characterCol: number,
  document: vscode.TextDocument
) {
  let loc = new vscode.Position(line, characterCol);
  let stepper = 0;

  while (stepper < 10) {
    if (document.getWordRangeAtPosition(loc)) {
      break;
    }

    stepper++;
    loc = new vscode.Position(line + stepper, characterCol);
  }

  return loc;
}

function error(message: string) {
  vscode.window.showErrorMessage(message);
}

export function deactivate() {
  // TODO
}
