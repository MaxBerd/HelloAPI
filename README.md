# HelloAPI
Application starts the HTTP server at port 3000 and HTTPS at port 3001 in staging environment,   and HTTP server at port 5000 and HTTPS at port 5001 in production environment.   on a curl request: GET http://localhost:3000/hello replies with status code 200 with JSON object   {   "Message": "Hello there!!! Your API is working now!" }  * On any other request replies with status code 404 and an empty string.  
