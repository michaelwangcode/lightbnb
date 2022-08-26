const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`,[email])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}

exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`,[id])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser = function(user) {
  return pool
    .query(`INSERT INTO users(name, email, password) VALUES($1, $2 ,$3) RETURNING *;`,[user.name, user.email, user.password])
    .then((result) => {
      console.log(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

exports.addUser = addUser;


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`
      SELECT properties.*, reservations.*, avg(rating) as average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;
    `,[guest_id, limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}

exports.getAllReservations = getAllReservations;



/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {

  // 1: Array that contains parameters for query
  const queryParams = [];

  // 2: The first part of the query, containing the SELECT, FROM and JOIN ON statements
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // If the user clicks on the "My Listings" page, the owner_id is used so add it to the query string
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `WHERE owner_id = $${queryParams.length} `;
  }

  // SEARCH

  // If there is a search query in one of the fields, add a WHERE to the query
  if (options.city || options.minimum_price_per_night || options.maximum_price_per_night || options.minimum_rating) {
    queryString += `WHERE `;
  }

  // 3: If the user enters a city in the search field, add it to the params array and add it to the query string
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `city LIKE $${queryParams.length} AND `;
  }

  // If the user enters a minimum price, add it to the query
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `cost_per_night > $${queryParams.length} AND `;
  }

  // If the user enters a maximum price, add it to the query
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `cost_per_night < $${queryParams.length} AND `;
  }

  // If the user enters a minimum rating, add it to the query
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `rating >= $${queryParams.length} AND `;
  }

  // Remove the last AND from the search string
  if (queryString.endsWith(`AND `)) {
    queryString = queryString.slice(0, -4)
  }


  // 4: Add any additional queries that come after the WHERE statement
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5: Console log for testing
  console.log(queryString, queryParams);

  // 6: Run the query string
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */

/*
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
*/

const addProperty = function(property) {

  let queryString = `
    INSERT INTO properties
    (owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  return pool
  .query(queryString, queryParams)
  .then((result) => {
    console.log(result.rows);
  })
  .catch((err) => {
    console.log(err.message);
  });
}



exports.addProperty = addProperty;
