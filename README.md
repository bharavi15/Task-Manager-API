# Task-Manager-API

Task Manager API is a Backend for Task Manager written with help of [Node.js](https://nodejs.org), [Express](https://expressjs.com), and [MongoDB](https://www.mongodb.com)

## Installation

Use Git clone to clone into the repository.

```cmd
git clone https://github.com/bharavi15/Task-Manager-API.git
```
Then install the required dependencies 
```cmd
cd Task-Manager-API && npm install
```

## Usage

### Configuration

Set the following Environment variables in ```./config/dev.env ```
```
APP_NAME = <Application-name>
PORT = <Port for server>
SENDGRID_API_KEY = <Sendgrid API Key for sending emails>
JWT_SECRET_KEY = <JWT Secret Key used for signing JWT>
MONGODB_URL = <MongoDB URL to connect to database>
MAINTENANCE_MODE = <true|false to enable or disable Maintenance mode>
SEND_EMAIL = <true|false to enable or disable sending emails>
```
Modify scripts in ```package.json``` file to match the file path 
```
"dev": "env-cmd -f <Path/to/.env> nodemon src/server.js"
"startdb": "<Path/to/mongod.exe> --dbpath <Path/to/database-storage>" 
```

### Running the server in Development mode

```cmd
npm run dev
```
### Using with Postman
Import the ```Task_App.postman_collection.json``` collection file to Postman.

Set the ```URL``` environment variable.

```JWTAuthToken``` environment variable is set for you, after Creating user or logging in.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
