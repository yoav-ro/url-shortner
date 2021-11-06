### Misc

- [ ] **Add workflow scripts**
  - [ ] build - webpack build ./web into ./public folder
  - [ ] dev - start a nodemon server && start webpack dev server
  - [ ] deploy to heroku

### Front

- [ ] **make better design**
- [ ] **home page** - /app
  - [ ] url shorten input -> POST /api/shrten/ { url: <input url> }
  - [ ] bootstrap nice design
  - [ ] nice error display
- [ ] **stats page** /app/<UID>
  - [ ] requests the stats from -> GET /api/stats/<UID>
  - [ ] error display
  - [ ] add dashboard with stats display:
    - [ ] locations of requests
    - [ ] unique requesters
    - [ ] usage graph

### Back

- [ ] POST /api/shorten/ { url: <input url> }
  - [ ] validate url
  - [ ] check if already was shortened
  - [ ] return the shorterned url
  - [ ] check if uid is realy unique
- [ ] GET /<UID>
  - [ ] store user req data
  - [ ] redirect to the URL
- [ ] GET /app
  - [ ] serve the static from ./public folder
- [ ] GET /api/stats/<UID>
  - [ ] respond with JSON of the stats
- [ ] **refactoring**
