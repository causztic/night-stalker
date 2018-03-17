# night-stalker

Simple Nightmare.js based Instagram scraper for recent activities.
The previous library I was using stopped working after Instagram removed their public facing APIs.
Public posts should be allowed access by people anyway because well, they are public.

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