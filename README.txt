This is a very simple backend app which I have developed it from the scratch using node.js.
The real app is larger than this, I selected few simple files just to represent how I work and the project structure.
I used the following tools and packages:
-	mongoose for talking to MongoDB
-	express for the working with HTTP and creating middleware in the pipeline.
-	winston for error handling
-       jsonwebtoken to generate token for authentication
-	And some other few packages ..

For generating token I set a jwt key/value in the invironment variable. Find the key in config/development.json.

The database in MongoDB should called 'daycare' as it's mentioned in config/default.json

The errors will be logged in this file minicyrus/logfile.log and in the same database in the errors Collection.
Using log file for the situation if the database goes down, and using db to log for running query if needed.

The test database is defined in the config/test.json, but for being able to run it in the test mode, of course you
 will need to set the environment variable. (NODE_ENV=test)



