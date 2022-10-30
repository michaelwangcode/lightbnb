# LightBnB

## About

LightBnB is a simple web application based on AirBnb.

It uses a PostgreSQL database to store information about users, properties listings, reservations and reviews.

Made during Lighthouse Labs (W

## Project Setup

Make sure PostgreSQL is installed.

Type `npm install` to download the packages for the project.

If using vagrant, type `vagrant up` and `vagrant ssh` in the terminal.

Start a new `psql` session by switching to the bootcampx dirctory and entering `psql` in the terminal.

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


