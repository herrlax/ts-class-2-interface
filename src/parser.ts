import {
  TypescriptParser,
  Declaration,
  ClassDeclaration
} from "typescript-parser";

export async function getClassDeclarations(code: string) {
  const parser = new TypescriptParser();
  const parsedCode = await parser.parseSource(code);
  const classDeclarations: Declaration[] = parsedCode.declarations.filter(
    d => d instanceof ClassDeclaration
  );

  return classDeclarations as ClassDeclaration[];
}

export async function getSignatureLength(code: string) {
  const lines = code.split("\n");
  return lines[0].trim().length;
}

export async function getSignatureSufix(interfaceName: string) {
  return `implements ${interfaceName} `;
}
