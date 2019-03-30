/*
 * Primary file for the HelloAPI
 *
 * Application starts the HTTP server at port 3000 and HTTPS at port 3001 in staging environment,
 * and HTTP server at port 5000 and HTTPS at port 5001 in production environment.
 * on a curl request: GET http://localhost:3000/hello replies with status code 200 with JSON object 
 * {
 *   "Message": "Hello there!!! Your API is working now!"
 * }
 * 
 * On any other request replies with status code 404 and an empty string.
 * 
 * Written by: Maksat Berdiyev 
 * March 2019
 */

//Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require('./config');
const fs = require("fs");

//Instantiate HTTP Server
let httpServer = http.createServer((req, res) => {
  Server(req, res);
});

// Instantiate HTTPS Server
httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};
let httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  Server(req, res);
});

//Start HTTP Server listening on Port 3000
httpServer.listen(config.httpPort, () => {
  console.log("HTTP Server is listening on Port: " + config.httpPort);
});

// Start HTTPS Server
httpsServer.listen(config.httpsPort, () => {
  console.log("HTTPS Server is listening on Port: " + config.httpsPort);
});

// Server logic for HTTP and HTTPS protocols
let Server = (req, res) => {
  // Get the url and parse it
  let parsedUrl = url.parse(req.url, true);

  // Get the path from that url
  let trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  let method = req.method.toLowerCase();

  // Get the Headers as an object
  let headers = req.headers;

  // Get the Paylod
  let decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handler for the request
    let chosenHandler = typeof router[trimmedPath] !== "undefined" ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler

    let data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer
    };

    //Route the request to the handler from the router object
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler or default to 404
      statusCode = typeof statusCode == "number" ? statusCode : 404;

      // Check that payload is an object and convert it to a string 
      payloadString = typeof payload == "object" ? JSON.stringify(payload) : '';

      //return the response
      res.setHeader("Content-type", "application.json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returned response: ", statusCode, payloadString);
    });
  });
};

// Define the handlers object
let handlers = {};

// hello handler
handlers.hello = (data, callback) => {
  callback(200, {
    Message: "Hello there!!! Your API is working now!"
  });
};

// notFound handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// Defining the request routers
let router = {
  hello: handlers.hello
};