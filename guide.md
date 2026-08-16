# Employee Management System — Local Setup Log

## Step 1.
Install JDK v17.x | v17 os required for my pom.xml file.
Install mySQL Server v8.0.x | Setup and create a password.
Install Node.Js v24.18.0 | windows .msi installer, npm v11.6.0 is included

## Step 2.
Add JDK-17 to JAVA_HOME.
In cmd
-- JAVA_HOME=<jdk-17's bin folder>

Add mySQL's bin folder to env variables.
In cmd (sql Login)
-- mySql -u root -p
Then enter password to login.

In application.properties file, configure the SQL password (keep username as root).

## Step 3.
Create SQL Database.
Login to sql using cmd.
In cmd,
-- CREATE DATABASE employeeManagement;

## Step 4 - Running the project.
Open cmd in backend folder: employeemangement - backend\employee-managment
-- mvnw spring-boot:run
And leave it running.

Open cmd in frontend folder: employeefrontend
-- npm install # it's a one time thing for each project.     ## This reads package.json and downloads react-scripts and everything else into a node_modules folder; basically whatever is in your project.
-- npm start   # will launch the host web server automatically

## Step 5.
Add/update/delete employee.

## Software Used:
JAVA - JDK 17
Spring Boot - v2.7.10
React 18.2.0
MySQL - v8.0
