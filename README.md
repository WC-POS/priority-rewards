# Priority Rewards

**Author:** [Devin Sharpe](https://github.com/devinsharpe) - *Priority1 POS*

**Contributors:**
- No one else 😭

## What is it?
---
Priority Rewards is a simple loyalty application developed from the ground up for [FuturePOS](https://futurepos.com) users and customers. The goal is create more engagement between restaurants and their customers, promoting healthier, more mutually beneficial relationships that can sustainably survive for years.

*Note:* Before running any component script, ensure that [Caddy](https://caddyserver.com/) is running within the root directory. All of the components rely on subdomains that are only accessible during local development via caddy reverse proxies.

**Start Caddy Server**
```bash
caddy
```

## Compoments

---

### 🟢 API
A Fastify web service connected to MongoDB using the fantastic Mongoose package. Of course, TypeScript is the 
main language of choice 🙌🏽 Admin and authentication functions are handled through REST endpoints, while the applications work through GraphQL channels.

**Current Feature Tasks**
- [ ] Finish Admin Account routes for Admin portal management
- [ ] Build Various Promotion models
- [ ] Add GraphQL and scope for regular account use only
- [ ] Add Phone Based Auth service for regular accounts

**Start API Server**
```bash
cd ./api 
yarn dev
```

*Additional Notes*
- Ensure that MongoDB server is running
- Use Docker for local development
- Credentials should be specified in root .env file

---

### 🟢 Progressive Web Applicaiton
A NextJS project communicating via GraphQL to the API service. Again, we're leveraging TS here and using utilty first CSS via [TailwindCSS](https://tailwindcss.com/).

The design can be viewed in [Figma](https://www.figma.com/file/R89KHdc7KUjriFYtaa1fVV/PriorityRewards?node-id=0%3A1)

**Current Feature Tasks**
- [ ] Generate project
- [ ] Complete phone based Auth workflow

**Start PWA Server**
```bash
cd ./app
yarn dev
```

---

### 🟢 Admin Web Applicaiton
Another NextJS project, currently in JS, but shortly being moved to TS. Styling and components are built using [Chakra UI](https://chakra-ui.com/). Most of the actions performed here are done via the API REST endpoints.

**Start Admin Server**
```bash
cd ./admin
yarn dev
```

---

### 🟢 Local Sync Application
Electron application for connecting the FPOS MSSQL DB to PriorityRewards cloud servers via generated API keys and a variety of API REST endpoints. Work is done in TS and based on the [ERB](https://electron-react-boilerplate.js.org/) template. For easy and safe DB functions, [TypeORM](https://typeorm.io/#/) is used for connecting to the FPOS DB.

**Start Development Application**
```bash
cd ./sync
yarn dev
```

**Generate TypeORM FPOS Models**
```bash
npx typeorm-model-generator
# This is done in interactive mode
# This may also take up to or even longer than ~20 minutes, the FPOS DB setup is large and complex
```

*Note:* Binary/native packages from npm must be installed to the applications secondary package.json found at ./sync/release/app/package.json.

---

### 🟡 Landing Page

Astro + Preact? Maybe, we'll see.

---

### 🟡 Mobile Application

Whew, I'm going to need to learn React Native sometime in the near future.
