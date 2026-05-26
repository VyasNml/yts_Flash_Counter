# YouTube Shorts Flash Counter

A privacy-first, lightweight Chrome Extension that tracks how many YouTube Shorts you have watched today and flashes a giant, responsive count overlay on your screen.

YouTube Shorts are designed to feel frictionless, which makes it easy to lose track of how much time you spend scrolling.

This extension adds a tiny moment of awareness by making every counted Short impossible to ignore. Built cleanly with native browser APIs, it avoids heavy background trackers and respects your data privacy.


## Features

- ### Instant Flash Overlay
    Displays your current Shorts count in a massive responsive overlay directly on top of the video.

 - ### Smart Dwell Detection
    Only counts a Short after you’ve watched it for at least 1 second, preventing accidental scroll counts.

 - ### Anti-Loop Protection
    Rewatching the same Short or scrolling backward won’t artificially inflate your stats.

 - ### Privacy First
    No analytics. No external servers. No background surveillance.

    Everything runs locally in your browser.

- ### Minimal & Lightweight
    No frameworks, no bloat, no unnecessary permissions.

> ## How to Setup

> Since this is an open-source developer build, you can load it directly into Google Chrome in less than a minute without needing the Chrome Web Store:

> 1. **Download the Code:** Click the green **Code** button at the top of this GitHub page and select **Download ZIP**. Extract the folder somewhere safe on your computer.

> 2. **Open Extensions Page:** Open a new tab in Chrome and navigate to `chrome://extensions/`.

> 3. **Enable Developer Mode:** Toggle the **Developer mode** switch in the top-right corner to **ON**.

> 4. **Load the Project:** Click the **Load unpacked** button in the top-left corner and select the unzipped project folder containing `manifest.json` and `content.js`.

> **You're all set!** Head over to YouTube, click the **Shorts** button on the sidebar, and watch your achievement counter fire.

## How It Works

The extension listens for navigation changes inside YouTube Shorts using a MutationObserver, detects when a new Short becomes active, and starts a short dwell timer.

If the viewer stays on the Short long enough:

- The daily counter increments
- The value is persisted locally using Chrome Storage
- A fullscreen flash overlay animates instantly on screen

Everything happens locally inside the active YouTube tab.

## Privacy

This extension:

- Does not collect analytics
- Does not track browsing history
- Does not send data anywhere
- Does not use external servers

Your Shorts count stays entirely on your device.
