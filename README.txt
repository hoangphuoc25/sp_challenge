To start server:
`$ docker-compose up`

To run test:
`$ docker-compose -f docker-compose.yml -f docker-compose.test.yml up`

API endpoints:

`POST /friend`: create new friend connection
e.g. `curl -XPOST http://localhost:3000/friend -H 'Content-Type: application/json' -d '{"friends": ["email1@gmail.com", "email2@gmail.com"]}'`

`GET /friends`: get all friends of a user by email
e.g. curl -XGET http://localhost:3000/friends?email=email1@gmail.com

`GET /commonFriends`: get all common friends of 2 users by email
e.g. curl -XGET http://localhost:3000/commonFriends?email1=email1@gmail.com&email2=email2@gmail.com

`POST /subscription`: allow a user to subscribe to updates from another user
e.g. curl -XPOST http://localhost:3000/blocking -H 'Content-Type: application/json' -d '{"requestor": "email4@gmail.com", "target": "email3@gmail.com"}'`

`POST /blocking`: block update from a user
e.g. curl -XPOST http://localhost:3000/blocking -H 'Content-Type: application/json' -d '{"requestor": "email4@gmail.com", "target": "email8@gmail.com"}'`

`POST /query/subscription`: get all user who will receive notification/update of a text from a user
e.g. curl -XPOST http://localhost:3000/query/subscription -H 'Content-Type: application/json' -d '{"sender": "email4@gmail.com", "text": "Hello world! email3@gmail.com email2@gmail.com"}'`

Database schema:
There are 2 main tables in the database: connection and block_list.
Each record in connection table describes a one way relationship between 2 users.
Since friendship is a 2-way relationship, we will have 2 records for every friend request, whereas only 1 record for a subscribe request.

