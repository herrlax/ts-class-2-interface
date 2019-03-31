import { getSignature, getDeclarations } from "../parser";

describe("Parser", () => {
  it("getSignature", () => {
    const signature = getSignature(`class Foo {
        public bar(prop: string) {}
    }`);
    expect(signature).toEqual("class Foo {");
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
