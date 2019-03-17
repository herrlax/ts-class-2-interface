import {
  getSignatureLength,
  createSignatureSuffix,
  getDeclarations
} from "../parser";

describe("Parser tests", () => {
  it("getSignatureLength returns correct length", () => {
    const length = getSignatureLength(`class Foo {
        public bar(prop: string) {}
    }`);
    expect(length).toEqual(11);
  });

  it("given an interface name createSignatureSuffix returns correct signature suffix", () => {
    const suffix = createSignatureSuffix("", "IFoo");
    expect(suffix.trim()).toEqual("implements IFoo");
  });

  it("getDeclarations returns an array of correct length", async () => {
    const ds = await getDeclarations(`
        class Foo {
            public string bar;
            public baz(prop: string) {}
        }`);

    expect(ds.length).toEqual(1);
  });
});
