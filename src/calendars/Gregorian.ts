import UniversalTimestamp from "../UniversalTimestamp";
import { Calendar } from "./Calendar";

/**
 * Gregorian Calendar rules:
 *
 * Years, days, hours, minutes, seconds match Universal Timestamp
 *
 * Each year after 1582 contains 365 days unless it is a leap year, which has 366.
 * A leap year is any year divisible by four, unless
 *   - it is also divisible by 100, unless
 *     - it is also divisible by 400
 *
 * In the year 1582, day 277 is October 4, day 278 is October 15, and December 31 is day 355
 *
 * @TODO: Localizable output
 * @TODO: Timezones: currently, everything is assumed to be in UTC+0
 */

enum Day {
  Sunday = 1,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
}

const daysInMonths = {
  leap: [
    [1, 31],
    [2, 29],
    [3, 31],
    [4, 30],
    [5, 31],
    [6, 30],
    [7, 31],
    [8, 31],
    [9, 30],
    [10, 31],
    [11, 30],
    [12, 31],
  ],
  nonLeap: [
    [1, 31],
    [2, 28],
    [3, 31],
    [4, 30],
    [5, 31],
    [6, 30],
    [7, 31],
    [8, 31],
    [9, 30],
    [10, 31],
    [11, 30],
    [12, 31],
  ],
};

export default class Gregorian implements Calendar {
  _year: number;
  /** 1-12 */
  _month: Month | null;
  _day: Day | null;
  _hour: number | null;
  _minute: number | null;
  _timeZoneOffset: number;
  _second: string | null;

  constructor() {
    this._year = 1;
    this._month = null;
    this._day = null;
    this._hour = null;
    this._minute = null;
    this._timeZoneOffset = 0;
    this._second = null;
  }

  get year() {
    return this._year;
  }

  set year(value) {
    this._year = value;
    this.validateDate();
  }

  get month() {
    return this._month;
  }

  set month(value) {
    this._month = value;
    this.validateDate();
  }

  get day() {
    return this._day;
  }

  set day(value) {
    this._day = value;
    this.validateDate();
  }

  get hour() {
    return this._hour;
  }

  set hour(value) {
    this._hour = value;
    this.validateDate();
  }

  get minute() {
    return this._minute;
  }

  set minute(value) {
    this._minute = value;
    this.validateDate();
  }

  get second() {
    return this._second;
  }

  set second(value: string | null) {
    if (typeof value === "number") {
      this._second = String(value);
    } else {
      this._second = value;
    }
  }

  get timeZoneOffset() {
    return this._timeZoneOffset;
  }

  set timeZoneOffset(value) {
    this._timeZoneOffset = value;
    this.validateDate();
  }

  get isLeap(): boolean {
    if (this.year) {
      if (this.year % 4 === 0) {
        if (this.year % 100 === 0) {
          if (this.year % 400 === 0) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  }

  validateDate() {
    // No Year 0
    if (this.year === 0) {
      throw new RangeError("Year 0 is invalid on this calendar");
    }

    if (this._month && this._day) {
      // More than 0 days
      if (this._day < 1) {
        throw new RangeError("Day must be > 0");
      }

      // 1582 rule
      if (
        this.year === 1582 &&
        this.month === Month.October &&
        this.day &&
        this.day >= 5 &&
        this.day <= 14
      ) {
        throw new RangeError(
          `The date October ${this.day} doesn't exist in 1582`
        );
      }

      // Not too many days in month
      const month = this.isLeap
        ? daysInMonths.leap[this._month - 1]
        : daysInMonths.nonLeap[this._month - 1];
      const monthDays = month[1];
      if (this._day && this._day > monthDays) {
        throw new RangeError(
          `Invalid day of month: ${this._year}${this._month}-${this._day}`
        );
      }
    }
  }

  getDayOfYear(): number | null {
    if (!this._day || !this._month) {
      return null;
    }

    const thisDaysInMonths = this.isLeap
      ? daysInMonths.leap
      : daysInMonths.nonLeap;

    let dayCounter = 0;
    let thisMonthIndex = 0;
    while (thisDaysInMonths[thisMonthIndex][0] < this._month) {
      dayCounter += thisDaysInMonths[thisMonthIndex][1];
      thisMonthIndex += 1;
    }
    dayCounter += this._day;

    if (this.year === 1582) {
      // The big adjustment year, where 10 days were dropped in October
      if (dayCounter > 287) {
        dayCounter -= 10;
      }
    }

    return dayCounter;
  }

  getDateFromDayOfYear(dayOfYear: number): { month: Month; day: number } {
    let thisDaysInMonths = this.isLeap
      ? daysInMonths.leap
      : daysInMonths.nonLeap;

    // This isn't quite right - it won't handle days in October
    // correctly
    //
    // if (this._year === 1582){
    //   thisDaysInMonths = [...thisDaysInMonths];
    //   thisDaysInMonths[9] = [10, 21];
    // }

    let daysRemaining = dayOfYear;
    let thisMonthIndex = 0;

    while (daysRemaining - thisDaysInMonths[thisMonthIndex][1] > 0) {
      daysRemaining -= thisDaysInMonths[thisMonthIndex][1];
      thisMonthIndex += 1;
    }
    return { month: thisDaysInMonths[thisMonthIndex][0], day: daysRemaining };
  }

  fromUniversal(uts: UniversalTimestamp) {
    // year
    this.year = uts.years;

    // month/day
    if (uts.precision.day === 1) {
      const { month, day } = this.getDateFromDayOfYear(uts.days);
      this.month = month;
      this.day = day;
    } else {
      this.month = null;
      this.day = null;
    }

    // hour
    if (uts.precision.hour === 1) {
      this.hour = uts.hours;
    } else {
      this.hour = null;
    }

    // minute
    if (uts.precision.minute === 1) {
      this.minute = uts.minutes;
    } else {
      this.minute = null;
    }

    // second
    if (uts.precision.second !== 0) {
      this._second = String(uts.seconds).padStart(2, "0");
    } else {
      this._second = null;
    }
  }

  toUniversal() {
    const uts = new UniversalTimestamp();
    uts.years = this.year;
    uts.precision.year = 1;

    if (this.year < 0) {
      uts.meridian = "<";
    } else {
      uts.meridian = ">";
    }

    const dayOfYear = this.getDayOfYear();
    if (dayOfYear !== null) {
      uts.days = dayOfYear;
      uts.precision.day = 1;
    } else {
      uts.precision.day = 0;
    }

    if (this.hour) {
      uts.hours = this.hour;
      uts.precision.hour = 1;
    } else {
      uts.precision.hour = 0;
    }

    if (this.minute) {
      uts.minutes = this.minute;
      uts.precision.minute = 1;
    } else {
      uts.precision.minute = 0;
    }

    if (this.second) {
      uts.seconds = parseFloat(this.second);
      if (this.second.length === 4) {
        uts.precision.second = 0.1;
      } else if (this.second.length === 5) {
        uts.precision.second = 0.01;
      } else if (this.second.length === 6) {
        uts.precision.second = 0.001;
      } else {
        uts.precision.second = 1;
      }
    } else {
      uts.precision.second = 0;
    }

    return uts;
  }

  // localization - oh boy
  toString(format: string = "default") {
    // ignoring the format for now
    // TODO: account for Timezone Offset
    let output = "";
    if (this.year < -9_999) {
      output = output + Math.abs(this.year) / 1000 + "KYA";
    } else if (this.year < -99_999) {
      output = output + Math.abs(this.year) / 1_000_000 + "MYA";
    } else if (this.year < -999_999_999) {
      output = output + Math.abs(this.year) / 1_000_000_000 + "BYA";
    } else {
      output += this.year;
    }

    if (this.month !== null) {
      output = `${output}-${this.month}`;

      if (this.day !== null) {
        output = `${output}-${this.day}`;
      }
    }

    if (this.hour !== null) {
      output = `${output} ${String(this.hour).padStart(2, "0")}`;
      if (this.minute !== null) {
        output = `${output}:${String(this.minute).padStart(2, "0")}`;
        if (this._second !== null) {
          const [second, subsecond] = this._second.split(".");
          output = `${output}:${second.padStart(2, "0")}.${subsecond}`;
        }
      }
    }

    return output;
  }
}
