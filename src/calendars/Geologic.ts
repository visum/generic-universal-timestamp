import UniversalTimestamp from "../UniversalTimestamp";
import {Calendar} from "./Calendar";

/**
 * Using the SI abbreviations for long time ago
 * 
 * @TODO: 
 * -1000 is actually 3ky ago
 * adjust for the current milennium
 */

export default class Geologic implements Calendar {
  year: number;
  precision: number;

  constructor() {
    this.year = -1;
    this.precision = 1;
  }

  fromUniversal(uts: UniversalTimestamp) {
    this.year = uts.years;
    if (uts.meridian === "<") {
      this.year *= -1;
    }
    this.precision = uts.precision.year;
  }

  toUniversal() {
    const uts = new UniversalTimestamp();
    uts.years = Math.abs(this.year);
    uts.meridian = this.year < 0 ? "<" : ">";
    uts.precision.year = this.precision;
    return uts;
  }

  toString() {
    if(this.year < -1_000_000_000) {
      return (Math.round(Math.abs(this.year) / 100_000_000) * .1) + "Gy ago";
    }
    if (this.year < -1_000_000) {
      return (Math.round(Math.abs(this.year) / 100_000) * .1) + "My ago";
    }
    if (this.year < -1_000) {
      return (Math.round(Math.abs(this.year) / 100) * .1) + "ky ago";
    }
    if (this.year < -1) {
      return this.year + " ago";
    }
    if (this.year > 1_000_000_000) {
      return (Math.round(Math.abs(this.year) / 100_000_000) * .1) + "Gy future";
    }
    if (this.year > 1_000_000) {
      return (Math.round(Math.abs(this.year) / 100_000) * .1) + "My future";
    }
    if (this.year > 1_000) {
      return (Math.round(Math.abs(this.year) / 100) * .1) + "ky future";
    }
    return this.year + "";
  }
}