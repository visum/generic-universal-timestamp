import reverse from "./lib/reverse";
import blurNumber from "./lib/blurNumber";

const regexp = /([<>])([\d~-]{3}),([\d~-]{3}),([\d~-]{3}),([\d~-]{3})\+([\d~-]{3})#([\d~-]{2}):([\d~-]{2}):([\d~-]{2})\.([\d~-]{4})/;

type MeridianFlag = "<" | ">";

export default class UniversalTimestamp {
  _meridian: MeridianFlag;
  _year: number;
  _precision: {year: number, day: number, hour: number, minute: number, second: number};
  _days: number;
  _hours: number;
  _minutes: number;
  _seconds: number;

  static validate(timestamp: UniversalTimestamp): boolean {
    // @TODO: validate
    return true;
  }

  parse(input: string): UniversalTimestamp {
    const matches = regexp.exec(input);
    if (matches.length === 0) {
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
    const numericYearString = normalizedYear.replace(/[~-]+/g, "0");
    timestamp._precision.year = yearPrecision;
    timestamp._year = parseInt(numericYearString, 10);

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
    if(this._precision.second !== 0) {
      const milliseconds = matches[10];
      const msDigits = [];
      ([...milliseconds]).forEach(char => {
        if(char === "~") {
          msDigits.push("0");
        } else {
          msDigits.push(char);
          timestamp._precision.second = this._precision.second / 10;
        }
      });
    }
    
    return timestamp;
  }

  toString(): string {
    // year
    const placeholderChar = this._meridian === "<" ? "-" : "~";
    let yearString = blurNumber(this._year, this._precision.year, placeholderChar);
    if (this._meridian === "<") {
      yearString = reverse(yearString);
    }

    // day
    let dayString = "~~~";
    if (this._precision.day === 1) {
      dayString = this._days + "";
    }
    
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
    let secondString = "~~.~~~~";
    if () {
      
    }
  }

  getYear(): number {
    return this._year;
  }

  setYear(year: number) {
    this._year = year;
  }

}
