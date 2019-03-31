import { ClassDeclaration } from "typescript-parser";
import { getProperties, getMethods } from "./parser";

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

export function createSignatureSuffix(
  signature: string,
  interfaceName: string
) {
  const prefix = signature.includes("implements") ? "," : " implements";
  const trailingSpace =
    signature.trim().charAt(signature.length - 2) !== " " ? " " : "";

  return `${prefix} ${interfaceName}${trailingSpace}`;
}
