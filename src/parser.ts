import { TypescriptParser } from "typescript-parser";

export async function getDeclarations(code: string) {
  const parser = new TypescriptParser();
  const parsedCode = await parser.parseSource(code);
  return parsedCode.declarations;
}

export function getInsertLocation(signature: string) {
  const stepper = signature.charAt(signature.length - 2) === " " ? 2 : 1;
  return signature.length - stepper;
}

export function getSignature(code: string) {
  return code
    .trim()
    .split("\n")[0]
    .trim();
}
