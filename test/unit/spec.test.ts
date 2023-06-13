import fs from "fs";
import path from "path";
import { expect } from "chai";
import { types } from "../types";

type TestData = {
  type: keyof typeof types;
  data: any;
} & (
  | {
      valid: true;
      treeRoot: string;
    }
  | {
      valid: false;
      errorCode: string;
    }
);

describe("Merkleizer", () => {
  const specTestDataPath = path.join(__dirname, "./spec-test-data");
  for (const testFile of fs.readdirSync(specTestDataPath)) {
    it(path.parse(testFile).name, () => {
      const testData: TestData = JSON.parse(
        fs.readFileSync(path.join(specTestDataPath, testFile), "utf8")
      );

      const type = types[testData.type];
      if (!type) {
        throw Error(`No type ${testData.type}`);
      }

      const data = toObjBigInt(testData.data);

      if (testData.valid) {
        expect(toHex(type.treeRoot(data))).to.equal(testData.treeRoot);
      } else {
        expect(() => type.treeRoot(data)).to.throw(testData.errorCode);
      }
    });
  }
});

function toHex(buf: Uint8Array): string {
  return "0x" + Buffer.from(buf).toString("hex");
}

function toObjBigInt(objHex: Record<string, string>): Record<string, bigint> {
  const objBigint: Record<string, bigint> = {};
  for (const [key, hex] of Object.entries(objHex)) {
    objBigint[key] = BigInt(hex as string);
  }
  return objBigint;
}
