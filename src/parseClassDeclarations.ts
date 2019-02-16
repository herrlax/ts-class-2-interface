import { TypescriptParser, Declaration, ClassDeclaration } from "typescript-parser";

export async function parseClassDeclarations(code: string) {
  const parser = new TypescriptParser();
  const parsedCode = await parser.parseSource(code);
  const classDeclarations: Declaration[] = parsedCode.declarations
    .filter(d => d instanceof ClassDeclaration);

  console.log(classDeclarations);

  return classDeclarations as ClassDeclaration[];
}