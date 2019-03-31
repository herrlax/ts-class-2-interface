import { TypescriptParser } from "typescript-parser";

export async function getDeclarations(code: string) {
  const parser = new TypescriptParser();
  const parsedCode = await parser.parseSource(code);
  return parsedCode.declarations;
}

export function getInsertLocation(signature: string) {
  const signatureLength = signature.length;
  let stepper = 1;

  if (signature.includes("implements")) {
    stepper = signature.charAt(signatureLength - 2) === " " ? 2 : 1;
  }

  return signatureLength - stepper;
}

export function getSignature(code: string) {
  return code
    .trim()
    .split("\n")[0]
    .trim();
}
