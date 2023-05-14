# Konnected

Konnected-proj is the main source folder inhabiting both the front-end and back-end. I'll describe about the functions of all those here. Let's first set up the project.

### Get Started
For the first time, open two terminal in VS Code. Only one will also be sufficient, but it will be better to have two terminal in split view for client and server. Then, follow the below steps to install dependencies and start the web:

*Note: You must have installed [Node] and [npm] (It's included within [Node] package installer. No need to download separately)
To check if node & npm is installed, run the command:
**Node --version**
**npm --version**
If installed correctly, you'll see the version number.*

[Node]: <https://nodejs.org/en/download>
[npm]: <https://nodejs.org/en/download>

**First Terminal (Client - React)**

-- To install all the libraries used in the project, that is mentioned in the package.json file.
```sh
cd client
npm i
```
-- To start the react app (Port is 3000) [For every Start]
```sh
npm start
```

**Second Terminal (Server - Node)**

-- To install all the libraries used in the project, that is mentioned in the package.json file.
```sh
cd server
npm i
```
-- To start the server (Port is 5000) [For every Start]
```sh
nodemon index
```
*This will use nodemon library to auto restart the server on every change or save.*

**Database - Postgresql**

-- Install [Postgresql] in the system
-- Run Postgresql DB
-- Open data.sql file in the utils folder of server and run the queries given (This is for the first time only)

[Postgreqls]: <https://www.postgresql.org/download/>

### Folder Structure

```
konnected-proj
└─── client
│   └─── public
│   │   │   index.html
│   └─── src
│   │   └─── components
│   │   │   └─── auths
│   │   │   │   │   login.jsx
│   │   │   │   │   register.jsx
│   │   │   └─── home
│   │   │   │   │   home.jsx
│   │   │   └─── utils
│   │   │   │   │   activateAccount.jsx
│   │   │   │   │   authContext.js
│   │   │   │   │   navbar.jsx
│   │   │   │   │   resetPassword.jsx
│   │   │   App.js
│   │   │   index.css
│   │   │   index.js
│   │   packagae-lock.json
│   │   package.json
│   │   README.md
│   │   tailwind.config.js
│   │
└─── server
│   └─── controllers
│   │   │   authController.js
│   │   │   btController.js
│   │   │   noteController.js
│   │   │   userController.js
│   └─── routes
│   │   │   authRoute.js
│   │   │   btRoute.js
│   │   │   noteRoute.js
│   │   │   userRoute.js
│   └─── utils
│   │   │   data.sql
│   │   │   db.js
│   │   │   queryDB.sql
│   │   index.js
│   │   packagae-lock.json
│   │   package.json
│   .gitignore
```
