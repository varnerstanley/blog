CREATE DATABASE blog;

CREATE TABLE posts
(
  post_id SERIAL PRIMARY KEY NOT NULL,
  post_title VARCHAR(300) NOT NULL,
  post_date TIMESTAMP NOT NULL,
  post_text TEXT NOT NULL,
  user_id int REFERENCES users(user_id)
);

CREATE TABLE users
(
  user_id INT PRIMARY KEY NOT NULL,
  user_firstName VARCHAR(100),
  user_lastName VARCHAR(100),
  user_email VARCHAR(100)
);

INSERT INTO posts (post_title, post_date, post_text)
  VALUES ('Second Title', '2019-03-19', 'This is the second post in this blog');
  INSERT INTO posts (post_title, post_date, post_text)
    VALUES ('Third Title', '2019-03-19', 'This is the Third post in this blog');

CREATE USER odin WITH PASSWORD 'sonofodin';
GRANT SELECT, INSERT, UPDATE, DELETE ON posts TO odin;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO odin;

GRANT USAGE, SELECT ON SEQUENCE posts_post_id_seq TO odin;
