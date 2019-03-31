import {
  ClassDeclaration,
  ScopedDeclaration,
  StaticDeclaration
} from "typescript-parser";

export interface IConstructedInterface {
  name: string;
  value: string;
}

export function constructInterface(
  cd: ClassDeclaration
): IConstructedInterface {
  const className = cd.name.charAt(0).toUpperCase() + cd.name.substring(1);
  const classProps = getProperties(cd);
  const classMethods = getMethods(cd);

  return {
    name: `I${className}`,
    value: `interface I${className} {\n${classProps}${classMethods}}\n`
  };
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

export function isPublicFacing(
  i: ScopedDeclaration & StaticDeclaration
): boolean {
  return i.visibility !== 0 && i.visibility !== 1 && !i.isStatic;
}

export function createSignatureSuffix(
  signature: string,
  interfaceName: string
) {
  const prefix = signature.includes("implements") ? "," : " implements";
  const trailingSpace =
    signature.charAt(signature.length - 2) !== " " ? " " : "";

  return `${prefix} ${interfaceName}${trailingSpace}`;
}
