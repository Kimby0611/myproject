-- 테이블 생성
CREATE TABLE IF NOT EXISTS cinema (
    cinemacd VARCHAR(20) PRIMARY KEY,
    cinemanm VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    tel VARCHAR(15) NOT NULL,
    status VARCHAR(20) NOT NULL,
    regincd VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS coupon (
    couponnum INT PRIMARY KEY AUTO_INCREMENT,
    userid VARCHAR(20) NOT NULL,
    couponcd INT(11) NOT NULL,
    couponname TEXT NOT NULL,
    couponstatus TINYINT(1),
    couponusedate DATE,
    couponexpiredate DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS region (
    regioncd VARCHAR(20) PRIMARY KEY,
    regionnm VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS mycinema (
    wishlistnum INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(20) NOT NULL,
    cinemacd VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS schedule (
    schedulecd VARCHAR(20) PRIMARY KEY,
    moviecd VARCHAR(20),
    screencd VARCHAR(20),
    startdate DATE,
    starttime DATETIME,
    endtime DATETIME
);

CREATE TABLE IF NOT EXISTS notice (
    noticenum BIGINT PRIMARY KEY,
    noticetype VARCHAR(20),
    noticesub VARCHAR(50),
    noticedate DATETIME,
    noticecontents TEXT,
    writer VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS review (
    reviewnum INT AUTO_INCREMENT PRIMARY KEY,
    reviewdate DATETIME,
    userid VARCHAR(20),
    moviecd VARCHAR(20),
    reviewcontents TEXT,
    rating TINYINT,
    likes INT,
    viewingpoints VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS reservation (
    reservationcd VARCHAR(20) PRIMARY KEY,
    userid VARCHAR(20),
    schedulecd VARCHAR(20),
    reservationtime DATETIME,
    reservationstatus VARCHAR(20),
    seatcd VARCHAR(255),
    paymentcd VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS faq (
    faqnum BIGINT PRIMARY KEY,
    faqsub VARCHAR(50),
    faqcontents TEXT,
    faqdate DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS payment (
    paymentcd VARCHAR(20) PRIMARY KEY,
    paymentmethod VARCHAR(50),
    paymenttime DATETIME,
    amount BIGINT,
    paymentstatus VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS movierank (
    movierankcd VARCHAR(20) PRIMARY KEY,
    moviename VARCHAR(255),
    movierank INT,
    rankchange INT,
    audiacc BIGINT
);

CREATE TABLE IF NOT EXISTS movie (
    moviecd VARCHAR(20) PRIMARY KEY,
    movienm VARCHAR(100),
    description TEXT,
    genre TEXT,
    director VARCHAR(50),
    actors TEXT,
    runningtime INT,
    releasedate DATE,
    posterurl VARCHAR(200),
    runningscreen VARCHAR(20),
    movieinfo VARCHAR(50) DEFAULT 'N',
    isadult VARCHAR(1)
);

CREATE TABLE IF NOT EXISTS staff (
    staffid VARCHAR(20) PRIMARY KEY,
    staffname VARCHAR(20),
    dept VARCHAR(20),
    position VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(50),
    theater VARCHAR(20),
    hiredate DATE,
    shifttype VARCHAR(10),
    role VARCHAR(20),
    status VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS screen (
    screencd VARCHAR(20) PRIMARY KEY,
    screenname VARCHAR(50),
    screentype VARCHAR(50),
    allseat INT,
    reservationseat INT,
    screenstatus VARCHAR(20),
    cinemacd VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS users (
    userid VARCHAR(20) PRIMARY KEY,
    userpw VARCHAR(60),
    username VARCHAR(20),
    email VARCHAR(50),
    phone VARCHAR(20),
    birth DATE,
    status VARCHAR(10),
    reg_date DATE
);

-- 뷰 생성
CREATE OR REPLACE VIEW schedule_view AS
SELECT s.schedulecd, s.startdate, s.starttime, m.movienm, m.moviecd,
m.runningscreen, m.runningtime, m.director, m.description, m.actors, m.posterurl, m.releasedate,
m.genre, m.movieinfo, m.isadult, mr.movierank, mr.rankchange,
sc.screenname, sc.screenstatus, sc.screentype, sc.allseat,
sc.reservationseat, c.cinemanm, r.regionnm
FROM schedule s
INNER JOIN movie m ON s.moviecd = m.moviecd
INNER JOIN screen sc ON s.screencd = sc.screencd
INNER JOIN cinema c ON sc.cinemacd = c.cinemacd
INNER JOIN region r ON c.regioncd = r.regioncd
INNER JOIN movierank mr ON s.moviecd = mr.movierankcd;

CREATE OR REPLACE VIEW reservation_view AS
SELECT r.reservationcd, r.seatcd, r.reservationtime, r.reservationstatus, sv.starttime, sv.movienm, sv.runningtime, sv.screenname, sv.cinemanm, r.userid, p.paymenttime, p.paymentmethod, p.amount
FROM reservation r
INNER JOIN schedule_view sv ON r.schedulecd = sv.schedulecd
INNER JOIN payment p ON r.paymentcd = p.paymentcd;

CREATE OR REPLACE VIEW screen_view AS
SELECT s.screencd, s.allseat, s.cinemacd, s.reservationseat, s.screenname, s.screenstatus, s.screentype, c.cinemanm, rg.regioncd, rg.regionnm
FROM screen s
INNER JOIN cinema c ON s.cinemacd = c.cinemacd
INNER JOIN region rg ON rg.regioncd = c.regioncd;

CREATE OR REPLACE VIEW view_movie_with_rank AS
SELECT m.moviecd, m.movienm, m.description, m.genre, m.director, m.actors, m.runningtime, m.releasedate, m.posterurl, m.runningscreen, m.movieinfo, m.isadult, r.movierankcd, r.movierank, r.rankchange
FROM movie m
LEFT JOIN movierank r ON m.movienm = r.moviename;

CREATE OR REPLACE VIEW review_view AS
SELECT r.reviewnum,
    u.userid,
    m.movienm,
    r.rating,
    r.likes
FROM review r
LEFT JOIN users u ON r.userid = u.userid
LEFT JOIN movie m ON r.moviecd = m.moviecd;

CREATE OR REPLACE VIEW moviewithschedule AS
SELECT m.moviecd, m.movienm, m.description, m.genre, m.director, m.actors, m.runningtime, m.releasedate, m.posterurl, m.runningscreen, m.movieinfo, m.isadult, mr.movierank
FROM movie m
LEFT JOIN movierank mr ON m.moviecd = mr.movierankcd
WHERE EXISTS (
    SELECT 1
    FROM schedule s
    WHERE s.moviecd = m.moviecd
);
