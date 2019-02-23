import { ClassDeclaration } from "typescript-parser";

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

function getProperties(cd: ClassDeclaration) {
  return cd.properties
    .map(p => {
      return p.visibility !== 0 && !p.isStatic
        ? `  ${p.name}${p.isOptional ? "?" : ""}: ${p.type};\n`
        : "";
    })
    .join("");
}

function getMethods(cd: ClassDeclaration) {
  return cd.methods
    .filter(m => {
      return m.visibility !== 0;
    })
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
