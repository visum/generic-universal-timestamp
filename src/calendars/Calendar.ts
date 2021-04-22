import UniversalTimestamp from "../UniversalTimestamp";

export interface Calendar {
  fromUniversal(universal: UniversalTimestamp): void;
  toUniversal(): UniversalTimestamp;
  toString(format:string): string;
}