import { ClassDeclaration } from "typescript-parser";

export function constructInterface(cd: ClassDeclaration) {
  const className = cd.name.charAt(0).toUpperCase() + cd.name.substring(1);
  const classProps = cd.properties.map(p => {
    return `  ${p.name}${p.isOptional ? '?' : ''}: ${p.type};`;
  }).join('\n');

  return `interface I${className} {\n${classProps}\n}`;
}