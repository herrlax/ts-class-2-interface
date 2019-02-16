import { ClassDeclaration } from "typescript-parser";

export function constructInterface(cd: ClassDeclaration) {
  const className = cd.name.charAt(0).toUpperCase() + cd.name.substring(1);
  const classProps = cd.properties.map(p => {
    return `  ${p.name}${p.isOptional ? '?' : ''}: ${p.type};`;
  }).join('\n');
  const classMethods = cd.methods
    .filter(m => { return m.visibility !== 0; })
    .map(m => {
      const params = m.parameters.map(p => {
        return `${p.name}: ${p.type}`;
      }).join(', ');

      return `  ${m.name}${params.length > 0 ? `(${params})` : ''}: ${m.type};`;
    }).join('\n');

  return `interface I${className} {\n${classProps}\n${classMethods}\n}\n`;
}