# Install and Run

This is a project based on the MERN (Mongo/Express/React/Node) stack. 

MongoDB should be installed in the localhost as an external dependency. It needs to be prepopulated with a users collection with docs that have {email, password_hash} for login. The seed data can be loaded into local mongo db from the seed directory in backend/db.
It has the test user/password: test@hcs.com / todo

To install the application:

   - Clone the repo
   - cd into the root directory
   - Run `npm install`
   - Run the ui from the root directory: `npm start`
   - Run the server: `node backend/server.js`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
