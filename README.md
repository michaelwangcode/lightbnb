# LightBnB

## About

LightBnB is a simple web application based on AirBnb.

It uses a PostgreSQL database to store information about users, properties listings, reservations and reviews.

Made during Lighthouse Labs (W05D2).

## Project Setup

Make sure PostgreSQL is installed.

Type `npm install` to download the packages for the project.

If using vagrant, type `vagrant up` and `vagrant ssh` in the terminal.

Start a new `psql` session by switching to the bootcampx directory and entering `psql` in the terminal.

Create a database called `lightbnb` by typing `CREATE DATABASE lightbnb;` and enter `\c lightbnb` to use it.

## Adding Data

Create the tables in the database by running the migration files:

`\i migrations/01_schema.sql`

Fill the tables with data by running all of the seeds files:

`\i seeds/01_seeds.sql`

`\i seeds/02_seeds.sql`

## Running the Web Application

Navigate to the LightBnb_WebApp folder and type `npm run local` to run the application.

The `database.js` file in the `server` folder contains the queries used to display the information in the application.

## Screenshots

### Home Page:

![](https://raw.githubusercontent.com/michaelwangcode/lightbnb/master/screenshots/home.png)

### Sign Up:

![](https://raw.githubusercontent.com/michaelwangcode/lightbnb/master/screenshots/signup.png)

### Log In:

![](https://raw.githubusercontent.com/michaelwangcode/lightbnb/master/screenshots/login.png)

### Create Listing:

![](https://raw.githubusercontent.com/michaelwangcode/lightbnb/master/screenshots/create.png)

