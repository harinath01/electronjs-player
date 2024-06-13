# Integration Guide: Shaka Player with Electron.js


## Introduction

This sample repository demonstrates integrating the Shaka Player with Electron.js to enable Widevine playback and offline download support.


## Minimum npm Version Requirement

Ensure your development environment meets the minimum npm version requirement of 16 for proper package management and dependency resolution.


## Using CastLabs Forked Version

To enable Widevine support and persistent license storage necessary for offline playback of Widevine-encrypted video, follow these steps:

- **Install CastLabs Forked Version:** Utilize the forked version of Electron from CastLabs. Refer to the [CastLabs Electron Releases](https://github.com/castlabs/electron-releases) documentation for detailed instructions.
- **VMP-Sign Your Application:** During development, it's essential to VMP-sign your Electron application. Refer to the [FAQ on VMP-Signing](https://github.com/castlabs/electron-releases/wiki/FAQ#how-can-i-vmp-sign-my-application-during-development) for guidelines.


