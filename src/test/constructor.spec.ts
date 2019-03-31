import { createSignatureSuffix } from "../constructor";
import { ClassDeclaration, MethodDeclaration } from "typescript-parser";

describe("Constructor", () => {
  describe("createSignatureSuffix", () => {
    it("returns suffix with implements keyword when class is not implementing any other interface", () => {
      const suffix = createSignatureSuffix("class Foo { ", "IFoo");
      expect(suffix.trim()).toEqual("implements IFoo");
    });

    it("returns correct suffix when class is implementing an other interface", () => {
      const suffix = createSignatureSuffix(
        "class Foo implements IBar { ",
        "IFoo"
      );
      expect(suffix.trim()).toEqual(", IFoo");
    });
  });
});
