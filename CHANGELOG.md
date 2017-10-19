# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Solution redone as [Language Server](https://code.visualstudio.com/docs/extensions/example-language-server)

## 0.1.3

### Added
- Check on underscore in variables
### Changed
- Fixed a number of issues reported on GitHub.

## 0.1.2
- WARNING: You can not yet disable the new features.

### Added
- Added fields to the model with Hungarian Notation check.
- Check for using WITH statement in Tables and Pages.
- Warning if local and local variables have the same name.
- Text Constants throw warning if they have the old notation (TextXXX).
- Temporary Table Variables must have TEMP, BUFFER, ARGS or ARGUMENTS in the name.
- Check for reserved words, e.g. a function name called "Action" or a field called "SetRange".

### Changed
- First version of refactoring is implemented. The function is always called "foo" and does not yet check if the selection makes sense or depends on variables. 
- Fixed issue with system variables Rec and xRec not being recognised as Hungarian Notation.
- Complex Type variables that are declared with object id instead of name give warning.
- Cleaned up the Type Script a bit here and there.

## 0.1.1

### Changed
- Implemented setting and fixed reported issues.

## 0.1.0
- First version