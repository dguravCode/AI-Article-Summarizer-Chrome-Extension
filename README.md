# AI-Article-Summarizer-Chrome-Extension
A Chrome extension that uses Google's Gemini API to generate concise summaries of articles and web content.

## Features

- Extracts article content from web pages
- Generates summaries in multiple formats:
  - Brief (2-3 sentences)
  - Detailed summary
  - Bullet points (5-7 key points)
- One-click copy functionality
- Clean, user-friendly popup interface

## Project Structure

```
├── manifest.json      # Extension configuration
├── popup.html         # Extension popup interface
├── popup.js           # Popup interaction logic
├── popup.css          # Popup styling
├── content.js         # Content script for article extraction
├── background.js      # Background service worker
├── icon2.png          # Extension icon
├── options.html       # Extension options page
├── options.js         # Extension options page
└── options.css        # Extension options page
```

## Technical Implementation

- Uses Chrome Extension APIs for browser integration
- Content scripts to extract article text from web pages
- Integrates with Google's Gemini API for text summarization
- Responsive popup UI for summary display and controls

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to any article or content page
2. Click the extension icon
3. Select summary type (Brief/Detailed/Bullets)
4. Click "Summarize" to generate summary
5. Use "Copy" button to copy the summary to clipboard

## Requirements

- Google Chrome browser
- Gemini API key for summarization functionality

## Screenshort
<img width="582" height="435" alt="image" src="https://github.com/user-attachments/assets/062486e0-e8da-494f-a92c-83f3eedc3726" />

