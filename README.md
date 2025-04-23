Small Business Billing and Payroll

Application description
	This web application is the capstone project for the course ICS 499 - Software Engineering and Capstone Project.
	The vision for this assignment is to create an application that provides the company 'Steve Ball and Associates' an easier way to handle their project management and billing. 

Requirements/ what the application uses:
	Java
	Xampp
	spring boot
	react
	maven
	node.js
	npm
	
	
setting up the project:

	installing java
		go to 'https://www.oracle.com/java/technologies/downloads/' and select the version built for your computer
		run the installer
		Open environment variables
			under system variables click on 'new'
				add the variable JAVA_HOME where the value of the variable is the path to the jdk
					example:
						JAVA_HOME = C:\...\Java\jdk-23
				Still operating under system variables, click on 'PATH' and add a path to the \bin file for java
					example:
						C:\...\Java\jdk-23\bin
      installing and setting up xampp
      		go to https://www.apachefriends.org/download.html and select the version compatible with your device
		run the installer
		if you already have mysql workbench + server prior to installing xampp, you may have issues with the default file configurations
			with a port number issue, you will need to alter the port number (for example, from 3306 to 3307) in the following files:
				my.ini under C:\Xampp\mysql
					# The following options will be passed to all MySQL clients
					[client]
					# password       = your_password 
					port=3306 
					#change the 'port' value from 3306 to a different port number
					socket="C:/xampp/mysql/mysql.sock"
				edit the config.inc.php file:
					/* Bind to the localhost ipv4 address and tcp */
					$cfg['Servers'][$i]['host'] = '127.0.0.1'; /*change the value to 127.0.0.1:#### where the #### is the port number of your choosing*/
					$cfg['Servers'][$i]['connect_type'] = 'tcp';
				and alter the mysql port number through xampps 'configuration of control panel' > 'service and port settings'
				and finally, alter the port number in the application.properties file
					# MySQL Database Connection
					spring.datasource.url=jdbc:mysql://localhost:3306/sbabilling 
					#change '3306' to the new port
				
		the application doesn't create the database itself, only the tables and data. To create the database that the app uses:
			open xampp and start apache and mysql.
			open the link http://localhost/phpmyadmin/index.php?route=/server/databases
			under 'create database', enter 'sbabilling' for the name of the database
			click on 'create' to make the database. You may have to restart your computer to have the app use this new database
	
	installing node.js and npm
		go to nodejs.org/download, and select the version built for your computer
		run the installer
		in 'environment variables' add the filepath to node.js to the 'path' variable (example path: C:\Program Files\nodejs\)
	
	Installing Spring boot
		Go to 'https://start.spring.io/'
			For the following fields, make sure to select the following values
				project = maven
				language = java
			click on download
			in your downloads folder, extract the contents
	
	Installing Maven
		Go to 'https://maven.apache.org/download.cgi'
		extract the folder into your desired location
		Open environment variables
			under system variables click on 'new'
				add the variable MAVEN_HOME where the value of the variable is the filepath to the maven folder
					examples:
						MAVEN_HOME = C:\...\apache-maven-3.9.9
			Still operating under system variables, click on 'PATH' and add a path to the \bin file for maven
				example:
						C:\...\Maven\apache-maven-3.9.9\bin
	
	Downloading a local copy of the github repository (eclipse as IDE example)
	clone the repository into your IDE program
		with your eclipse, you perform: 
			window->show view->other...->git->git repositories
			use the url: [redacted]
			when entering the username and password, you may have to use a personal access token instead of your GitHub password.
			after which you will import the file
				file->import->git->projects from git->existing local repository
					select the cloned repository and hit 'finish'
			when the project is imported and can be found in the 'package explorer'
				
				in the project explorer window, right click on the root folder and click maven->convert to maven project


	Open environment variables
		under system variables click on 'new'
			add a variable for java where the value of the variable is the filepath to their respective folder
				examples:
					JAVA_HOME = C:\...\Java\jdk-23
			Still operating under system variables, click on 'PATH' and add a path to the \bin file for java
				example:
					C:\...\Java\jdk-23\bin

	install react dependencies:
		open the ide command terminal, change the path to the sbafrontend folder and run the command: npm install @mui/icons-material
	
	
	
To run the application:
	open xampp and start mysql and apache
	
	Open IDE, and navigate to the sbafrontent folder
		run the command: npm start

	run the NewbillingsystemApplication.java file in the IDE


Contributors:
	Jeremy Marks,
	Patrick Lee,
	Aaron Nguyen,
	Austin Silva
