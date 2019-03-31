import { createSignatureSuffix } from "../constructor";

describe("Constructor", () => {
  describe("createSignatureSuffix", () => {
    describe("when signature is not missing a white space before {", () => {
      it("returns suffix with implements keyword when class is not implementing any other interface", () => {
        const suffix = createSignatureSuffix("class Foo {", "IFoo");
        expect(suffix).toEqual(" implements IFoo");
      });

      it("returns correct suffix when class is implementing an other interface", () => {
        const suffix = createSignatureSuffix(
          "class Foo implements IBar {",
          "IFoo"
        );
        expect(suffix).toEqual(", IFoo");
      });
    });

    describe("when signature is missing a white space before {", () => {
      it("returns suffix with implements keyword when class is not implementing any other interface", () => {
        const suffix = createSignatureSuffix("class Foo{", "IFoo");
        expect(suffix).toEqual(" implements IFoo ");
      });

      it("returns correct suffix when class is implementing an other interface", () => {
        const suffix = createSignatureSuffix(
          "class Foo implements IBar{",
          "IFoo"
        );
        expect(suffix).toEqual(", IFoo ");
      });
    });
  });
});
