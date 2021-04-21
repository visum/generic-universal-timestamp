import UniversalTimestamp from "../UniversalTimestamp";

export interface Calendar {
  fromUniversal(universal: UniversalTimestamp);
  toUniversal(): UniversalTimestamp;
  toString(format:string): string;
}