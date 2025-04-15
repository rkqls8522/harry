#USE s12p12a408;

DROP TABLE IF EXISTS schedules;
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    expire_time DATETIME NOT NULL,
    alarm_time DATETIME NOT NULL
);

DROP TABLE IF EXISTS quick_memo_tag;
DROP TABLE IF EXISTS quick_memo;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS feeling;

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    member_id BIGINT NOT NULL
);

CREATE TABLE quick_memo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NULL,
    created_at DATETIME NULL,
    member_id BIGINT NOT NULL
);

CREATE TABLE quick_memo_tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quick_memo_id INT NOT NULL,
    tag_id INT NOT NULL,
    member_id BIGINT NOT NULL,
    FOREIGN KEY (quick_memo_id) REFERENCES quick_memo(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE feeling (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    anger INT DEFAULT 0,
    disgust INT DEFAULT 0,
    fear INT DEFAULT 0,
    happy INT DEFAULT 0,
    sad INT DEFAULT 0,
    surprise INT DEFAULT 0
);

#SHOW PROCESSLIST;
SELECT * FROM schedules;
SELECT * FROM quick_memo;
SELECT * FROM quick_memo_tag;
SELECT * FROM tags;
SELECT * FROM feeling;
#SELECT * FROM member;