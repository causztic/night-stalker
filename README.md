# night-stalker

Simple Nightmare.js based Instagram Scraper for recent activities.

## Features
- Gets up to 12 recent posts (video, post, carousel photos)

## Getting Started
This library requires Node 8 and above.
```
yarn install
```

## Usage
```javascript
  const balanar = new NightStalker(username);
  const posts = await balanar.getPosts(noOfPosts);
```