
# Real Echoes

Real Echoes is a web application designed to let users receive anonymous messages through a personalized public profile link. It provides a safe and simple platform where anyone can send messages without revealing their identity. Users can securely manage and view their received messages through an intuitive interface.


## Tech Stack

**Next.js (TypeScript)** for fast and efficient server-side rendering and dynamic front-end experiences with.

**MongoDB** as the database for storing user information and anonymous messages.

**Auth.js** for handling authentication and user identity, ensuring only verified users can create and manage their profiles.

**Resend** for seamlessly sending notification emails to users to verify their newly registered email.

## Features

- User Registration with Email Verification
- Authentication & Authorization
- User Dashboard
- Manage received messages
- Enable/Disable anonymous accept messages

## Upcoming Features

- AI Integration to provide Message suggestions
- Dark theme
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`ENVIRONMENT` development or production

`MONGODB_URI` Mongo DB Connection URI

`RESEND_APIKEY` Resend API Key

`AUTH_SECRET` Auth secret generate using `npx auth`


## Installation

To Install project dependencies and packages, Run following command in terminal. Make sure terminal path is your project directory path.

```bash
  npm install
```
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/VirenLaniyaDev/real-echoes.git
```

Go to the project directory

```bash
  cd real-echoes
```

Install dependencies

```bash
  npm install
```

Start the server locally

```bash
  npm run dev
```


## Authors

- [@VirenLaniyaDev](https://www.github.com/VirenLaniyaDev)

