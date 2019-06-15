# night-stalker
[![npm version](https://badge.fury.io/js/night-stalker.svg)](https://badge.fury.io/js/night-stalker)

Simple Instagram scraper for recent activities.

The previous library I was using stopped working after Instagram removed their public facing APIs.
Public posts should be readily accessible by people anyway because well, they are public.

## Features
- Gets up to 12 recent posts (video, post, carousel photos)

## Getting Started
This library requires Node 8.10.0 and above as it utilizes on ```async/await```, and as per ESLint's requirements.
```
yarn install
```

## Usage
```javascript
  const balanar = await NightStalker.loadBrowser();
  balanar.setUserName('username-to-scrape');
  
  const posts = await balanar.getPosts(noOfPosts);
```

## TODO
- Check if user has any insta-story
- Check if user is live