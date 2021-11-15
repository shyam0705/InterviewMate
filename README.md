# InterviewMate

Tired of having seprate links for video/audio and code editors in interview.InterviewMate is solution. It provides complete environment to conduct tech interviews.

## Live

https://interview-mate.herokuapp.com/

## Features

- ## Audio-video interface

  - Implemented using webrtc
  - currently supports maximum 4 users in one room

- ## Real-time whiteboard
  - Implemented using javascript and socketIO
- ## Real-time code editor to write and run code
  - currently supports java,c,c++
  - Implemented using socketIO,
    https://github.com/Jaagrav/CodeX,
    https://codemirror.net/
- ## Real-time chat box

  - supports group as well as personal chat
  - Implemented using socketIO

- ## Host can add participants through mail
  - used nodemailer to send mail

## Run Locally

Clone the project

```bash
git clone https://github.com/shyam0705/InterviewMate
```

Go to the project directory

```bash
cd my-project
```

Install dependencies

```bash
npm install
```

Go to client folder and install it's dependencies

```bash
cd client
npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`accountSid=XXX`(twillo account sid)

`accountToken=XXX`(twillo account password)

`host=smtp.gmail.com`(email service you want to use in node mailer for gmail-smtp.gmail.com)

`port=587`(port to use in nodemailer 587 for smtp)

`user=`(your email id)

`pass=`(your email id's password)

Start the server

```bash
node server.js
```

Start client

```bash
npm start
```

your server will start on port 5000 and client on 3000.

## Tech Stack

**Client:**

- React
- Redux
- SocketIO
- JavaScript
- WEBRTC

**Server:**

- Node
- Express
- SocketIO
- nodemailer

## Authors

- [@Shyam Patel](https://github.com/shyam0705/InterviewMate)
