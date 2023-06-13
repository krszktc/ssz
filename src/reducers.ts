import { ReductionStrategy } from "./reduction.strategies";
import { encodeChunks } from "./encoder";
import { UnitRecord } from "./union.type";

export const TREE_DEGREE = 3;
export const BYTES_PER_CHUNK = 32;

export type ReducerRecord = Record<string, string>;

export interface Reducer {
  adjustField: (value: string, vLength: number) => string;
  reduce: (record: ReducerRecord) => Uint8Array;
}

const toUnit8Array = (value: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(value, 'hex'));
}

class EmptyReducer implements Reducer {
  adjustField(_v: string, _l: number): string {
    return '';
  }

  reduce(_: ReducerRecord): Uint8Array {
    return new Uint8Array(BYTES_PER_CHUNK);
  };
}

class SmallReducer implements Reducer {
  constructor(private strategy: ReductionStrategy) { }

  adjustField(value: string, vLength: number): string {
    const missingZeros = vLength - value.length;
    return value + '0'.repeat(missingZeros);
  }

  reduce(record: ReducerRecord): Uint8Array {
    const reduction = this.strategy.reductions
      .map(rdc => rdc.get(record))
      .join();
    return toUnit8Array(reduction);
  };
}

class ContainerReducer implements Reducer {
  constructor(private strategy: ReductionStrategy) { }

  adjustField(value: string, vLength: number): string {
    const missingZeros = vLength - value.length;
    if (value === '0') {
      return '0'.repeat(missingZeros + 1)
    }
    return this.endian(value) + '0'.repeat(missingZeros);
  }

  reduce(record: ReducerRecord): Uint8Array {
    const zeroHex = '0'.repeat(BYTES_PER_CHUNK * 2)
    const allChunks = this.strategy.reductions
      .map(rdc => rdc.get(record))
      .concat(Array(this.strategy.levelRest).fill(zeroHex));
    return toUnit8Array(encodeChunks(allChunks));
  };

  private endian(value: string): string {
    const indices = [];
    for (let i = value.length - 2; i >= 0; i -= 2) {
      indices.push(value[i]);
      indices.push(value[i + 1]);
    }
    return indices.join('');
  }
}

export const getReducer = (fields: UnitRecord): Reducer => {
  const fieldsSize = Object.keys(fields).length;
  if (fieldsSize === 0) {
    return new EmptyReducer();
  }
  if (fieldsSize === 3) {
    return new SmallReducer(
      new ReductionStrategy(fields)
    );
  }
  return new ContainerReducer(
    new ReductionStrategy(fields)
  );
}