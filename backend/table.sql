CREATE TABLE participants (
  id serial PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at timestamp NOT NULL,
  member boolean,
  response json ,
  score int,
  submitted_at timestamp
);