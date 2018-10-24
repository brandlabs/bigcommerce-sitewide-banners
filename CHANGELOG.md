# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Updated endpoint calls to use BigCommerce v3 API since previos form is deprecated now. This had the effect to us removing the test banner creation since Banners are not yet on v3.

### Added
- Information about transpiled files on webpack.common.js files.

### Fixed
- When not used the sitewide banners package a TypeError was thrown because the banners array was not empty but with an `undefined` object.

## [0.0.3] - 2018-02-23
### Added
- This document

### Changed
- Include WebPack in default Grunt tasks
- ESLint to ignore Gruntfile

## [0.0.2] - 2018-02-19
### Fixed
- Minor cleanup of dependencies

## [0.0.1] - 2018-02-17
### Added
- Initial project

[Unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.0...v0.0.1
