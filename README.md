# NAV Skills AL Lint

The NAV Skills extension is designed for AL and Dynamics NAV. It allows you to refactor code into a new function or codeunit and let's you test an object against guidelines for clean code.

## Features

The extension will check your code as you are working on it. It checks the open file and shows warnings.

Provides two commands

* Refactor - Move one or more lines of code into a new function or new codeunit. (Not working yet)

* Clean Code - Check your current object against coding guidelines for clean code. This will generate a summary report. (Not working yet)

## Requirements

Some AL code

## Extension Settings

- `allint.enabled` - enable/disable allint.
- `allint.statusbar` - enable/disable statusbar.
- `allint.checkcommit` - check code for COMMIT.
- `allint.checkhungariannotation` - check code for hungarian notation.
- `allint.hungariannotationoptions` - defines Hungarian Notation options.

## Hungarian Notation Options

By default the extension will check the following abbreviations
    Record,Rec
    Integer,Int
    Code,Cod
    Function,Func
    Codeunit,Cdu
    Page,Pag
    Text,Txt",

Which can be changed by modifying the HungarianNotationOptions setting like this
    "Record,Rec;Integer,Int;Code,Cod;Function,Func;Codeunit,Cdu;Page,Pag;Text,Txt",

## Status Bar Explanation

The status bar will show which function you are editing and its hallstead complexity and cyclomatic complexity.

If the text is green, you are good. Orange and Red should explain itsself.

https://en.wikipedia.org/wiki/Halstead_complexity_measures

## Known Issues

Next up is the refactoring command and then uploading the summary to a report

## Release Notes

### 0.1.1

Implemented setting and fixed reported issues.

### 0.1.0

First version