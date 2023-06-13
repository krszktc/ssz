export type UnitRecord = Record<string, UintType>

export class UintType {
  readonly totalLength = this.bytes * 2;

  constructor(public bytes: number) { };

  match(hex: string): boolean {
    return this.totalLength >= hex.length
  }
}
