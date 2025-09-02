USE erp_db;

-- department_table 생성
CREATE TABLerp_dberp_dberp_dberp_dbasset_tableE department_table (
    department_name VARCHAR(100) NOT NULL DEFAULT '',
    department_code INT NOT NULL DEFAULT 100,
    PRIMARY KEY (department_code)
);

-- asset_table 생성
CREATE TABLE asset_table (
    asset_number INT NOT NULL DEFAULT 100,
    asset_name VARCHAR(100) NOT NULL DEFAULT '',
    asset_price INT NOT NULL DEFAULT 100,
    create_company VARCHAR(100) NULL DEFAULT NULL,
    create_year DATE NULL DEFAULT NULL,
    buy_department VARCHAR(100) NULL DEFAULT NULL,
    buy_year DATE NULL DEFAULT NULL,
    disposal_status ENUM('사용', '폐기') NOT NULL DEFAULT '사용',
    PRIMARY KEY (asset_number)
);

asset_table

-- user_table 생성
CREATE TABLE user_table (
    user_name VARCHAR(100) NOT NULL DEFAULT '',
    rrn_front VARCHAR(6) NOT NULL DEFAULT '',
    rrn_back VARCHAR(64) NOT NULL DEFAULT '',
    user_id VARCHAR(100) NOT NULL DEFAULT '',
    user_pw VARCHAR(64) NOT NULL DEFAULT '',
    email VARCHAR(100) NULL DEFAULT NULL,
    phone VARCHAR(20) NULL DEFAULT NULL,
    PRIMARY KEY (user_id)
);

-- 기존 테이블 삭제 (존재하면)
DROP TABLE IF EXISTS user_table;

DROP TABLE IF EXISTS asset_table;

DROP TABLE IF EXISTS department_table;

-- department_table 생성
CREATE TABLE department_table (
    department_name VARCHAR(50) NOT NULL DEFAULT '',
    department_code VARCHAR(5) NOT NULL DEFAULT '100',
    PRIMARY KEY (department_code)
);

-- asset_table 생성
CREATE TABLE asset_table (
    asset_number VARCHAR(5) NOT NULL DEFAULT '100',
    asset_name VARCHAR(100) NOT NULL DEFAULT '',
    asset_price INT NOT NULL DEFAULT 100,
    create_company VARCHAR(100) NULL DEFAULT NULL,
    create_year DATE NULL DEFAULT NULL,
    buy_department VARCHAR(100) NULL DEFAULT NULL,
    buy_year DATE NULL DEFAULT NULL,
    disposal_status ENUM('사용', '폐기') NOT NULL DEFAULT '사용',
    PRIMARY KEY (asset_number)
);

-- user_table 생성
CREATE TABLE user_table (
    user_name VARCHAR(50) NOT NULL DEFAULT '',
    rrn_front CHAR(6) NOT NULL DEFAULT '',
    rrn_back VARCHAR(64) NOT NULL DEFAULT '' UNIQUE, -- UNIQUE 제약 추가
    user_id VARCHAR(100) NOT NULL DEFAULT '',
    user_pw VARCHAR(64) NOT NULL DEFAULT '',
    email VARCHAR(100) NULL DEFAULT NULL,
    phone VARCHAR(13) NULL DEFAULT NULL,
    PRIMARY KEY (user_id)
);