-- Create Database
CREATE DATABASE konnected;

-- Create Ranks Table
CREATE TABLE ranks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        points VARCHAR(50) NOT NULL
        );
        INSERT INTO ranks (id, name, points) 
        VALUES (1, 'Beginner', '0 - 500 XP'),
        (2, 'Apprentice', '501 - 1000 XP'),
        (3, 'Journeymen', '1001 - 5000 XP'),
        (4, 'Expert', '5001 - 10000 XP'),
        (5, 'Master', '10001 - 25000 XP'),
        (6, 'Grandmaster', '25001 - 50000 XP'),
        (7, 'Legend', '50001+ XP')
        ON CONFLICT DO NOTHING;

-- Create Levels Table
CREATE TABLE levels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sl_name VARCHAR(255) NOT NULL,
        is_verified VARCHAR(1)
        );
INSERT INTO levels (id, name, is_verified) 
        VALUES (1, 'Grade 1', '1'),
        (2, 'Grade 2', '1'),
        (3, 'Grade 3', '2'),
        (4, 'Grade 4', '1'),
        (5, 'Grade 5', '1'),
        (6, 'Grade 6', '1'),
        (7, 'Grade 7', '1'),
        (8, 'Grade 8', '1'),
        (9, 'Grade 9', '1'),
        (10, 'Grade 10', '1'),
        (11, 'Grade 11 - Science', '1'),
        (12, 'Grade 12 - Science', '1'),
        (13, 'Grade 11 - Humanities', '1'),
        (14, 'Grade 12 - Humanities', '1'),
        (15, 'Grade 11 - Management', '1'),
        (16, 'Grade 12 - Management', '1')
        ON CONFLICT DO NOTHING;

-- Create Users table
CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(40) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(10),
        avatar VARCHAR(1000),
        bio VARCHAR(255),
        tinymce TEXT,
        gpt TEXT,
        points INT,
        balance INT,
        rank INT,
        level INT,
        is_admin VARCHAR(1),
        is_activated VARCHAR(1),
        reset_token VARCHAR(100),
        activate_token VARCHAR(100),
        CONSTRAINT fk_rank
          FOREIGN KEY(rank) 
          REFERENCES ranks(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_level
          FOREIGN KEY(level) 
          REFERENCES levels(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
        );
-- Create Books Table
CREATE TABLE books (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        s_name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        cover VARCHAR(300) NOT NULL,
        author VARCHAR(50),
        is_verified VARCHAR(1),
        upload_date DATE(),
        uid INT,
        verify_token VARCHAR(10),
        CONSTRAINT fk_user
          FOREIGN KEY(uid) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);
-- Create Topics Table
CREATE TABLE topics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        st_name VARCHAR(255) NOT NULL
);

-- Create BookLevel Junction Table
CREATE TABLE bookLevel (
        id SERIAL PRIMARY KEY,
        book_id INT,
        level_id INT,
        CONSTRAINT fk_book
          FOREIGN KEY(book_id) 
          REFERENCES books(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_level
          FOREIGN KEY(level_id) 
          REFERENCES levels(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

CREATE TABLE topicBook (
        id SERIAL PRIMARY KEY,
        topic_id INT,
        book_id INT,
        CONSTRAINT fk_topic
          FOREIGN KEY(topic_id) 
          REFERENCES topics(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_book
          FOREIGN KEY(book_id) 
          REFERENCES books(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

-- Create Subtopics Table
CREATE TABLE subtopics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sst_name VARCHAR(255) NOT NULL,
        topic INT,
        CONSTRAINT fk_topic
          FOREIGN KEY(topic) 
          REFERENCES topics(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

-- Create Notes Table
CREATE TABLE notes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(500) NOT NULL,
        body TEXT NOT NULL,
        sst_name VARCHAR(500) NOT NULL,
        subtopic INT,
        uid INT,
        date Date,
        CONSTRAINT fk_subtopic
          FOREIGN KEY(subtopic) 
          REFERENCES subtopics(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_user
          FOREIGN KEY(uid) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

INSERT INTO notes (name,body,sst_name,subtopic,uid) VALUES
('First Note Title', '<h1>This is the first note title of the whole project!</h1>', 'first-note-title',4,5);


INSERT INTO notes (name,body,sst_name,subtopic,uid) VALUES
('Second Note Title', '<h1>This is the second note title of the whole project!</h1>', 'second-note-title',3,5);


INSERT INTO notes (name,body,sst_name,subtopic,uid) VALUES
('Third Note Title', '<h1>This is the third note title of the whole project!</h1>', 'third-note-title',3,5);


-- Create FollowTable Junction Table
CREATE TABLE follows (
        id SERIAL PRIMARY KEY,
        follower_id INT,
        following_id INT,
        CONSTRAINT fk_follower
          FOREIGN KEY(follower_id) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_following
          FOREIGN KEY(following_id) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

-- Create Notifications Junction Table (1 means read)
CREATE TABLE notifications (
        id SERIAL PRIMARY KEY,
        content TEXT,
        link TEXT,
        uid INT,
        read VARCHAR(1),
        CONSTRAINT fk_user
          FOREIGN KEY(uid) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

-- Create Notes Table
CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        body TEXT,
        sq_name VARCHAR(500) NOT NULL,
        topic INT,
        uid INT,
        date Date,
        CONSTRAINT fk_topic
          FOREIGN KEY(topic) 
          REFERENCES topics(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_user
          FOREIGN KEY(uid) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

-- Create Notes Table
CREATE TABLE answers (
        id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        question INT,
        vote INT,
        uid INT,
        date Date NOT NULL,
        CONSTRAINT fk_question
          FOREIGN KEY(question) 
          REFERENCES questions(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_user
          FOREIGN KEY(uid) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

-- Create VoteTable Junction Table
CREATE TABLE votes (
        id SERIAL PRIMARY KEY,
        answer INT,
        uid INT,
        CONSTRAINT fk_answer
          FOREIGN KEY(answer) 
          REFERENCES answers(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        CONSTRAINT fk_user
          FOREIGN KEY(uid) 
          REFERENCES users(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
);

INSERT INTO answers(body,question,vote,uid,date) VALUES(
  '
  <div><h2>Second Page</h2>
<p>My Trest lies over the ocean.</p>
<p>My Yepr lies over the sea.</p>
<p>My Bonnie lies over the ocean.</p>
<p>Oh, bring back my Bonnie to me.</p></div>
  ',
  1,
  0,
  8,
  '2023-03-12'
);

SELECT a.id as aid, vote, a.uid as auid FROM answers a JOIN users u ON a.uid=u.id WHERE question=1 ORDER BY vote DESC;

SELECT a.id as aid, a.question as qid, vote, a.uid as auid, a.date
FROM answers a JOIN votes v ON v.answer=a.id WHERE question=1 
GROUP BY a.id
ORDER BY COUNT(v.status) filter(WHERE v.status='up') DESC 
COUNT(v.status) filter(WHERE v.status='down') ASC;