import {
  TypescriptParser,
  ScopedDeclaration,
  StaticDeclaration,
  ClassDeclaration
} from "typescript-parser";

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

export function isPublicFacing(
  i: ScopedDeclaration & StaticDeclaration
): boolean {
  return i.visibility !== 0 && i.visibility !== 1 && !i.isStatic;
}

export function getProperties(cd: ClassDeclaration): string {
  return cd.properties
    .filter(isPublicFacing)
    .map(p => {
      return `  ${p.name}${p.isOptional ? "?" : ""}: ${p.type};\n`;
    })
    .join("");
}

export function getMethods(cd: ClassDeclaration): string {
  return cd.methods
    .filter(isPublicFacing)
    .map(m => {
      const params = m.parameters
        .map(p => {
          return `${p.name}: ${p.type || "void"}`;
        })
        .join(", ");

      return `  ${m.name}(${params.length > 0 ? `${params}` : ""}): ${m.type ||
        "void"};\n`;
    })
    .join("");
}
