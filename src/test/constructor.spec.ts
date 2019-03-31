import { isPublicFacing, getMethods, getProperties } from "../constructor";
import {
  ClassDeclaration,
  MethodDeclaration,
  PropertyDeclaration
} from "typescript-parser";

describe("Constructor", () => {
  describe("isPublicFacing", () => {
    it("returns false when visibility is private", () => {
      const foo = {
        name: "foo",
        visibility: 1,
        isStatic: false
      };
      expect(isPublicFacing(foo)).toEqual(false);
    });

    it("returns false when visibility is protected", () => {
      const foo = {
        name: "foo",
        visibility: 1,
        isStatic: false
      };
      expect(isPublicFacing(foo)).toEqual(false);
    });

    it("returns true when visibility is public", () => {
      const foo = {
        name: "foo",
        visibility: 2,
        isStatic: false
      };
      expect(isPublicFacing(foo)).toEqual(true);
    });

    it("returns false when isStatic is true", () => {
      const foo = {
        name: "foo",
        visibility: 2,
        isStatic: true
      };
      expect(isPublicFacing(foo)).toEqual(false);
    });
  });

  describe("getMethods", () => {
    const classDecl = new ClassDeclaration("Foo", false);

    beforeAll(() => {
      classDecl.methods = [];
    });

    it("returns a public method correctly", () => {
      classDecl.methods = [
        new MethodDeclaration("bar", false, 2, undefined, false, false, false)
      ];

      expect(getMethods(classDecl).trim()).toEqual("bar(): void;");
    });

    it("does not return protected method", () => {
      classDecl.methods = [
        new MethodDeclaration("bar", false, 1, undefined, false, false, false)
      ];

      expect(getMethods(classDecl).trim()).toEqual("");
    });

    it("does not return private method", () => {
      classDecl.methods = [
        new MethodDeclaration("bar", false, 0, undefined, false, false, false)
      ];

      expect(getMethods(classDecl).trim()).toEqual("");
    });

    it("does not return static method", () => {
      classDecl.methods = [
        new MethodDeclaration("bar", false, 2, undefined, false, true, false)
      ];

      expect(getMethods(classDecl).trim()).toEqual("");
    });
  });

  describe("getProperties", () => {
    const classDecl = new ClassDeclaration("Foo", false);

    beforeAll(() => {
      classDecl.properties = [];
    });

    it("return a public property correctly", () => {
      classDecl.properties = [
        new PropertyDeclaration("bar", 2, "string", false, false)
      ];

      expect(getProperties(classDecl).trim()).toEqual("bar: string;");
    });

    it("return an optinal property correctly", () => {
      classDecl.properties = [
        new PropertyDeclaration("bar", 2, "string", true, false)
      ];

      expect(getProperties(classDecl).trim()).toEqual("bar?: string;");
    });

    it("does not return a protected property", () => {
      classDecl.properties = [
        new PropertyDeclaration("bar", 1, "string", false, false)
      ];
      expect(getProperties(classDecl).trim()).toEqual("");
    });

    it("does not return a private property", () => {
      classDecl.properties = [
        new PropertyDeclaration("bar", 0, "string", false, false)
      ];
      expect(getProperties(classDecl).trim()).toEqual("");
    });

    it("does not return a static property", () => {
      classDecl.properties = [
        new PropertyDeclaration("bar", 2, "string", false, true)
      ];
      expect(getProperties(classDecl).trim()).toEqual("");
    });
  });
});
