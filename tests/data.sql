INSERT INTO users (username, password)
VALUES
  ('test', 'scrypt:32768:8:1$4BUoI5m38H3aTqDA$1309a76015ea2d55de7d2f483cfcfa99981fe6dfd79242fccde59cf387a3462cdb5670110bb1215bad2f92c5bd19fae15350ea14feb8dd02d778edfd65413fae'),
  ('other', 'scrypt:32768:8:1$4BUoI5m38H3aTqDA$1309a76015ea2d55de7d2f483cfcfa99981fe6dfd79242fccde59cf387a3462cdb5670110bb1215bad2f92c5bd19fae15350ea14feb8dd02d778edfd65413fae');

INSERT INTO posts (title, body, author_id, created)
VALUES
  ('test title', 'test' || x'0a' || 'body', 1, '2024-12-01 00:00:00');