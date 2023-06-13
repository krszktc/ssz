import { ReducerRecord, getReducer } from "./reducers";
import { UintType, UnitRecord } from "./union.type";

export type ContainerRecord = Record<string, bigint>;

export class ContainerType {
  private reducer = getReducer(this.fields);

  constructor(private fields: UnitRecord) { };

  treeRoot(value: ContainerRecord): Uint8Array {
    const reducerData: ReducerRecord = {};
    Object.entries(this.fields).forEach(([key, uType]) =>
      reducerData[key] = this.totHex(uType, value[key])
    );
    return this.reducer.reduce(reducerData);
  }

  private totHex(uType: UintType, bigValue?: bigint): string {
    if (bigValue === undefined) {
      throw new Error('MISSING_KEY');
    }
    const hexValue = bigValue.toString(16);
    if (!uType.match(hexValue)) {
      throw new Error('UINT_TOO_BIG');
    }
    return this.reducer.adjustField(hexValue, uType.totalLength);
  }
}