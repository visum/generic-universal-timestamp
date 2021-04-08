# Universal Timestamp

    MYYY,YYY,YYY,YYY+DDD#HH:MM:SS.ssss

Where

 * M = Meridian flag
 * Y = Year digits
 * D = Day digits
 * H = Hour digits
 * M = Minute digits
 * S = Second digits
 * s = Second decimal digits

## Design Goals

The Universal Timestamp should:

 * be independent from any other calendaring system
 * be easly sortable by ASCII character order
 * be stored as a simple ASCII string
 * represent varying precisions from billions of years to milliseconds 
 * represent up to at least 13.8 billion years ago

Every timestamp is the same length, regardless of offset amount or precision.

Dates are expressed as offsets in years, days, hours, minutes, seconds, and milliseconds
from a meridian. The meridian is borrowed from the Gregorian calendar.

The first character identifies if the date expressed is before or after the meridian.
A "<" character signifies a year before AD 1 on the Gregorian calendar, and a ">" indicates
AD 1 or later.

## Pre-meridian years

If a timestamp begins with "<", indicating a year before AD 1, the year is expressed
with the most significant digit on the right side, the number being padded on the left
with the non-precision placeholder character "-" and on the right with zeros.

For example:

|  UT Year           |  Gregorian  |
|--------------------|-------------|
| `<231,000,000,000` |  123 BC |
| `<---,---,--8,310` |  13.8 Billion Years Ago (Age of Universe) |
| `<---,209,152,000` |  251.902 Million Years Ago (Beginning of Triassic) |

## Post-meridian years

A timestamp beginning with ">" indicates a year on or after AD 1. The most significant digit
is on the left, the most familiar way for most people. Dates are padded on the left by
zeros, and on the right by the non-precision placeholder character, "~".

In ASCII character order, the "-" preceds numbers, where the tilde "~" comes after.
Using the "~" for a non-precision placeholder in post-meridian years helps maintain 
sort order.

For example:

| UT Year            |  Gregorian          |
|--------------------|---------------------|
| `>000,000,001,492` |  AD 1492            |
| `>005,~~~,~~~,~~~` |  5 Billion years from now (expected death of the Sun) |
| `>000,000,000,746` |  AD 746 (Fall of the Western Roman Empire) |

### Days and Times

Regardless of meridian, the plus character (+) follows the year and denotes
the start of the three day digits represnting the date's day of year.

The `~` character is used as a placeholder where precision is unknown.

For example:

| Timestamp                            |  Note        |
|--------------------------------------|--------------|
| `>000,000,001,492+013#~~:~~:~~.~~~~` | January 13, 1492, Time unknown |
| `>000,000,001,969+197#13:31:~~.~~~~` | July 16, 1969 at 13:31 UTC     |

The day, hour, minute, and second segements must contain all digits or all placeholders. This
time segement is invalid: `+10~#1~:4~:2~.~~~`.

The decimal second segement can have variable precision.

