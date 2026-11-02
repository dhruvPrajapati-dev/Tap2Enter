-- ===========================================
-- TAP2ENTER ENTRY / EXIT CONTROL SYSTEM
-- DATABASE
-- ===========================================

DROP DATABASE IF EXISTS tap2enter;

CREATE DATABASE tap2enter;

USE tap2enter;

-- ===========================================
-- ADMIN TABLE
-- ===========================================

CREATE TABLE admin (

    adminID INT AUTO_INCREMENT PRIMARY KEY,

    fullName VARCHAR(100) NOT NULL,

    username VARCHAR(50) NOT NULL UNIQUE,

    passwordHash VARCHAR(255) NOT NULL,

    email VARCHAR(100) UNIQUE,

    contactNo VARCHAR(15) UNIQUE,

    status ENUM('Active','Inactive') DEFAULT 'Active',

    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP

);

-- ===========================================
-- SYSTEM TABLE
-- ===========================================

CREATE TABLE system (

    sysID INT AUTO_INCREMENT PRIMARY KEY,

    systemName VARCHAR(100) NOT NULL,

    address VARCHAR(255),

    contactNo VARCHAR(15),

    email VARCHAR(100) UNIQUE,

    masterUsername VARCHAR(50) UNIQUE,

    masterPasswordHash VARCHAR(255) NOT NULL,

    publicUsername VARCHAR(50) UNIQUE,

    publicPasswordHash VARCHAR(255) NOT NULL,

    status ENUM('Active','Inactive') DEFAULT 'Active',

    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP

);

-- ===========================================
-- USER TABLE
-- ===========================================

CREATE TABLE user (

    userID VARCHAR(10) PRIMARY KEY,

    sysID INT NOT NULL,

    fullName VARCHAR(100) NOT NULL,

    contactNo VARCHAR(15) NOT NULL,

    email VARCHAR(100) UNIQUE,

    NFCID VARCHAR(50) UNIQUE,

    photoPath VARCHAR(255),

    faceEncoding LONGTEXT,

    status ENUM('Active','Inactive') DEFAULT 'Active',

    registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_system
    FOREIGN KEY(sysID)
    REFERENCES system(sysID)

);

-- ===========================================
-- VISITOR TABLE
-- ===========================================

CREATE TABLE visitor (

    visitorID VARCHAR(10) PRIMARY KEY,

    sysID INT NOT NULL,

    fullName VARCHAR(100) NOT NULL,

    contactNo VARCHAR(15) NOT NULL,

    email VARCHAR(100),

    photoPath VARCHAR(255),

    faceEncoding LONGTEXT,

    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_visitor_system
    FOREIGN KEY(sysID)
    REFERENCES system(sysID)

);

-- ===========================================
-- VISITOR VISIT TABLE
-- ===========================================
/* 
CREATE TABLE visitorvisit (

    visitID INT AUTO_INCREMENT PRIMARY KEY,

    visitorID VARCHAR(10) NOT NULL,

    sysID INT NOT NULL,

    purpose VARCHAR(200) NOT NULL,

    visitDate DATE NOT NULL,

    status ENUM('Inside','Outside') DEFAULT 'Inside',

    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_visit_visitor
    FOREIGN KEY(visitorID)
    REFERENCES visitor(visitorID),

    CONSTRAINT fk_visit_system
    FOREIGN KEY(sysID)
    REFERENCES system(sysID)

); */

-- ===========================================
-- USER ENTRY EXIT TABLE
-- ===========================================

CREATE TABLE userentryexit (

    recordID BIGINT AUTO_INCREMENT PRIMARY KEY,

    userID VARCHAR(10) NOT NULL,

    entryMethod ENUM('NFC','FACE') NOT NULL,

    entryTime DATETIME NOT NULL,

    exitTime DATETIME,

    status ENUM('Inside','Outside') DEFAULT 'Inside',

    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_entry_user
    FOREIGN KEY(userID)
    REFERENCES user(userID)

);

-- ===========================================
-- VISITOR ENTRY EXIT TABLE
-- ===========================================
/* 
CREATE TABLE visitorentryexit (

    recordID BIGINT AUTO_INCREMENT PRIMARY KEY,

    visitID INT NOT NULL,

    entryMethod ENUM('FACE','MANUAL') NOT NULL,

    entryTime DATETIME NOT NULL,

    exitTime DATETIME,

    status ENUM('Inside','Outside') DEFAULT 'Inside',

    createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_entry_visit
    FOREIGN KEY(visitID)
    REFERENCES visitorvisit(visitID)

);

-- ===========================================
-- SAMPLE ADMIN
-- ===========================================

INSERT INTO admin(

fullName,
username,
passwordHash,
email,
contactNo

)

VALUES(

'Super Admin',
'admin',
'admin123',
'admin@tap2enter.com',
'9999999999'

);

-- ===========================================
-- SAMPLE SYSTEM
-- ===========================================

INSERT INTO system(

systemName,
address,
contactNo,
email,
masterUsername,
masterPasswordHash,
publicUsername,
publicPasswordHash

)

VALUES(

'ABC Organization',
'Rajkot',
'9876543210',
'info@abc.com',
'master',
'master123',
'public',
'public123'

); */