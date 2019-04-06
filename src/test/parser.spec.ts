import {
  getSignature,
  getDeclarations,
  isPublicFacing,
  getProperties,
  getMethods,
  getInsertCol
} from "../parser";
import {
  PropertyDeclaration,
  ClassDeclaration,
  MethodDeclaration
} from "typescript-parser";

describe("Parser", () => {
  it("getDeclarations", async () => {
    const ds = await getDeclarations(`
        class Foo {
            public string bar;
            public baz(prop: string) {}
        }`);

    expect(ds.length).toEqual(1);
  });

  describe("getInsertLocation", () => {
    describe("when a signature is missing a white space before {", () => {
      it("return signature length - 1", () => {
        const insertAt = getInsertCol("class Foo{");
        expect(insertAt).toEqual("class Foo{".length - 1);
      });
    });

    describe("when a signature is not missing a white space before {", () => {
      it("return signature length - 2", () => {
        const insertAt = getInsertCol("class Foo {");
        expect(insertAt).toEqual("class Foo {".length - 2);
      });
    });
  });

  it("getSignature", () => {
    const signature = getSignature(`class Foo {
        public bar(prop: string) {}
    }`);
    expect(signature).toEqual("class Foo {");
  });

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
});
