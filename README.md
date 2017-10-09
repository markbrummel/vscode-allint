# NAV Skills AL Lint

The NAV Skills extension is designed for AL and Dynamics NAV. It allows you to refactor code into a new function or codeunit and let's you test an object against guidelines for clean code.

## Features

The extension will check your code as you are working on it. It checks the open file and shows warnings.

Provides two commands

* Refactor - Move one or more lines of code into a new function or new codeunit. (In Prototype)

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
    Text,Txt
    Field,Fld

Which can be changed by modifying the HungarianNotationOptions setting like this
    "Record,Rec;Integer,Int;Code,Cod;Function,Func;Codeunit,Cdu;Page,Pag;Text,Txt;Field,Fld"

## Status Bar Explanation

The status bar will show which function you are editing and its hallstead complexity and cyclomatic complexity.

If the text is green, you are good. Orange and Red should explain itsself.

https://en.wikipedia.org/wiki/Halstead_complexity_measures

## Known Issues

Next up is the refactoring command and then uploading the summary to a report

## Release Notes

### 0.1.3

Fixed a number of issues reported on GitHub.

Check on underscore in variables

### 0.1.2

First version of refactoring is implemented. The function is always called "foo" and does not yet check if the selection makes sense or depends on variables. 
Fixed issue with system variables Rec and xRec not being recognised as Hungarian Notation.
Added fields to the model with Hungarian Notation check.
Check for using WITH statement in Tables and Pages.
Warning if local and local variables have the same name.
Text Constants throw warning if they have the old notation (TextXXX).
Temporary Table Variables must have TEMP, BUFFER, ARGS or ARGUMENTS in the name.
Check for reserved words, e.g. a function name called "Action" or a field called "SetRange".
Complex Type variables that are declared with object id instead of name give warning.
Cleaned up the Type Script a bit here and there.

WARNING: You can not yet disable the new features.

### 0.1.1

Implemented setting and fixed reported issues.

### 0.1.0

First version