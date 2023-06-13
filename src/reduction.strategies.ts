import { BYTES_PER_CHUNK, ReducerRecord, TREE_DEGREE } from "./reducers";
import { UnitRecord } from "./union.type";

export class ReductionStrategy {
  private _reductions: Reduction[] = [];
  private _leverRest = 0;

  constructor(private fields: UnitRecord) {
    this.setReductions();
    this.setLevelRest();
  }

  get reductions(): Reduction[] {
    return this._reductions;
  }

  get levelRest(): number {
    return this._leverRest;
  }

  private setReductions() {
    let keys: string[] = [];
    let byteSum = 0;
    Object.entries(this.fields).forEach(([key, unit]) => {
      if (byteSum + unit.bytes > BYTES_PER_CHUNK) {
        this.addReduction(keys, byteSum);
        keys = [];
        byteSum = 0;
      }
      byteSum += unit.bytes;
      keys.push(key);
    });
    if (keys.length) {
      this.addReduction(keys, byteSum);
    }
  }

  private addReduction(keys: string[], byteSum: number) {
    const remindZeros = '0'.repeat((BYTES_PER_CHUNK - byteSum) * 2);
    this._reductions.push(new Reduction(keys, remindZeros));
  }

  private setLevelRest() {
    const fieldLength = Object.keys(this.fields).length;
    let level = 1;
    while (level < fieldLength) {
      level *= TREE_DEGREE;
    }
    this._leverRest = level - this._reductions.length;
  }
}

export class Reduction {
  constructor(
    private keys: string[],
    private postfix: string,
  ) { }

  get(model: ReducerRecord) {
    if (this.keys.length > 1) {
      const keyString = this.keys.map(key => model[key]).join('');
      return keyString + this.postfix;
    }
    return model[this.keys[0]] + this.postfix;
  }
}

