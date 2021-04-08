import reverse from "./lib/reverse";
import blurNumber from "./lib/blurNumber";

const regexp = /([<>])([\d~-]{3}),([\d~-]{3}),([\d~-]{3}),([\d~-]{3})\+([\d~-]{3})#([\d~-]{2}):([\d~-]{2}):([\d~-]{2})\.([\d~-]{4})/;

type MeridianFlag = "<" | ">";
type Precision = {year: number, day: number, hour: number, minute: number, second: number};

export default class UniversalTimestamp {
  private _meridian: MeridianFlag;
  private _years: number;
  private _precision: Precision;
  private _days: number;
  private _hours: number;
  private _minutes: number;
  private _seconds: number;

  constructor() {
    this._precision = {
      year: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    };
  }

  static validate(timestamp: UniversalTimestamp): boolean {
    // @TODO: validate
    return true;
  }

  static parse(input: string): UniversalTimestamp {
    const matches = regexp.exec(input);
    if (!matches) {
      throw new TypeError("Given string was not parseable as timestamp");
    }

    // year
    const timestamp = new UniversalTimestamp();
    timestamp._meridian = matches[1] as MeridianFlag;
    const combinedYear = `${matches[2]}${matches[3]}${matches[4]}${matches[5]}`;

    const normalizedYear = timestamp._meridian === "<" ? reverse(combinedYear) : combinedYear;
    let yearPrecision = 1;

    let index = normalizedYear.length - 1;
    let char = normalizedYear[index];
    while(char === "~" || char === "-") {
      yearPrecision *= 10;
      char = normalizedYear[--index];
    }
    const numericYearString = normalizedYear.replace(/[~-]/g, "0");
    timestamp._precision.year = yearPrecision;
    timestamp._years = parseInt(numericYearString, 10);

    // day
    if(matches[6] === "~~~") {
      timestamp._precision.day = 0;
    } else {
      timestamp._precision.day = 1;
      timestamp._days = parseInt(matches[6], 10);
    }

    // hour
    if(matches[7] === "~~") {
      timestamp._precision.hour = 0;
    } else {
      timestamp._precision.hour = 1;
      timestamp._hours = parseInt(matches[7], 10)
    }

    // minute
    if(matches[8] === "~~") {
      timestamp._precision.minute = 0;
    } else {
      timestamp._precision.minute = 1;
      timestamp._minutes = parseInt(matches[8], 10);
    }

    // second
    if(matches[9] == "~~") {
      timestamp._precision.second = 0;
    } else {
      timestamp._precision.second = 1;
      timestamp._seconds = parseInt(matches[9], 10);
    }

    // fractions of second
    if(timestamp._precision.second !== 0) {
      const milliseconds = matches[10];
      const msDigits = [];
      ([...milliseconds]).forEach(char => {
        if(char === "~") {
          msDigits.push("0");
        } else {
          msDigits.push(char);
          timestamp._precision.second = timestamp._precision.second / 10;
        }
      });
      const fractionalSeconds = parseFloat("0." + msDigits.join(""));
      timestamp._seconds += fractionalSeconds;
    }
    
    return timestamp;
  }

  toString(): string {
    // year
    const placeholderChar = this._meridian === "<" ? "-" : "~";
    let yearString = blurNumber(this._years, this._precision.year, placeholderChar);
    if (this._meridian === "<") {
      yearString = reverse(yearString);
    }

    // day
    let dayString = blurNumber(this._days, this._precision.day);
    
    // hour
    let hourString = "~~";
    if (this._precision.hour === 1) {
      hourString = this._hours + "";
    }

    // minute
    let minuteString = "~~";
    if (this._precision.minute === 1) {
      minuteString = this._minutes + "";
    }

    // second
    let secondString = blurNumber(this._seconds, this._precision.second);

    return `${this._meridian}${yearString}+${dayString}#${hourString}:${minuteString}:${secondString}`;
  }

  get years(): number {
    return this._years;
  }

  set years(value: number) {
    this._years = value;
  }

  get precision(): Precision {
    return this._precision;
  }

  get days(): number {
    return this._days;
  }

  set days(value: number) {
    this._days = value;
  }

  get hours(): number {
    return this._hours;
  }

  set hours(value: number) {
    this._hours = value;
  }

  get minutes(): number {
    return this._minutes;
  }

  set minutes(value: number) {
    this._minutes = value;
  }

  get seconds(): number {
    return this._seconds;
  }

  set seconds(value: number) {
    this._seconds = value;
  }

  get meridian(): MeridianFlag {
    return this._meridian;
  }

  set meridian(value: MeridianFlag) {
    if (String.length > 1 || !["<", ">"].includes(value)) {
      throw new TypeError("Invalid meridian flag: " + value);
    }
    this._meridian = value;
  }

}
