import {
  getSignatureLength,
  createSignatureSuffix,
  getDeclarations
} from "../parser";

describe("Parser", () => {
  it("getSignatureLength", () => {
    const length = getSignatureLength(`class Foo {
        public bar(prop: string) {}
    }`);
    expect(length).toEqual(11);
  });

  it("createSignatureSuffix", () => {
    const suffix = createSignatureSuffix("", "IFoo");
    expect(suffix.trim()).toEqual("implements IFoo");
  });

  it("getDeclarations", async () => {
    const ds = await getDeclarations(`
        class Foo {
            public string bar;
            public baz(prop: string) {}
        }`);

    expect(ds.length).toEqual(1);
  });
});
