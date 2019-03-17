import { TypescriptParser } from "typescript-parser";

export async function getDeclarations(code: string) {
  const parser = new TypescriptParser();
  const parsedCode = await parser.parseSource(code);
  return parsedCode.declarations;
}

export function getSignatureLength(code: string) {
  const lines = code.split("\n");
  return lines[0].trim().length;
}

export function createSignatureSuffix(
  signature: string,
  interfaceName: string
) {
  const prefix = signature.includes("implements") ? "," : " implements";
  return `${prefix} ${interfaceName} `;
}
