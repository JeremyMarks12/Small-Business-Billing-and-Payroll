CREATE DATABASE payrollBillingDB;
use payrollBillingDB;

CREATE TABLE worker (
    workerID INTEGER,
    workerFName VARCHAR(10),
    workerLName VARCHAR(10),
    workerUser VARCHAR(10),
    workerPW VARCHAR(10),
    isAdmin boolean,
    PRIMARY KEY (workerID)
);

CREATE TABLE company (
	companyID INTEGER,
    companyName VARCHAR(10),
    PRIMARY KEY (companyID)
);

CREATE TABLE workOrder (
    workOrderID INTEGER,
    workerFName VARCHAR(10),
    workerLName VARCHAR(10),
    workerUser VARCHAR(10),
    workerPW VARCHAR(10),
    isAdmin boolean,
    PRIMARY KEY (workOrderID)
);

create TABLE completedWO (
	completedWOID INTEGER,
    companyID INTEGER,
	item VARCHAR(20),
    fileNo INTEGER,
    myPrice DOUBLE,
    SBATotal DOUBLE,
    assessment VARCHAR(1),
    plat VARCHAR(1),
    address VARCHAR(25),
    woDate VARCHAR(25),
    PRIMARY KEY (completedWOID),
    foreign key (companyID) REFERENCES company,
    foreign key (workOrderID) REFERENCES workOrder
);

-- Worker test
INSERT INTO worker (workerID, workerFName, workerLName, workerUser, workerPW, isAdmin) 
VALUES (1001, 'Alfred', 'Smith', 'AS01', 'helloWorld', 1);
select * from worker;

-- company Test

-- workOrder Test

-- Completed Work Order test


