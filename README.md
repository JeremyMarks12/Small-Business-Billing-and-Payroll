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
			use the url: https://github.com/JeremyMarks12/Small-Business-Billing-and-Payroll.git
			when entering the username and password, you may have to use a personal access token instead of your GitHub password.
			after which you will import the file
				file->import->git->projects from git->existing local repository
					select the cloned repository and hit 'finish'
			when the project is imported and can be found in the 'package explorer'
				open the two files called application.properties found under 
					small-business-billing-and-payroll->myDemo->target->META-INF
					and
					small-buisiness-billing-and-payroll->myDemo->src->main->resources

					edit the following fields to make the project compatible with your computer
						spring.datasource.url=
							change to the url of your server and database "jdbc:mysql://[hostname]:[port]/[database name]"
								[database name] == payrollBillingDB
						spring.datasource.username
							change this to the value of your username for MySQL, if your username is not root
						spring.datasource.password
							change this to the value of your password for MySQL
				in the project explorer window, right click on the root folder and click maven->convert to maven project


	Open environment variables
		under system variables click on 'new'
			add a variable for java where the value of the variable is the filepath to their respective folder
				examples:
					JAVA_HOME = C:\...\Java\jdk-23
			Still operating under system variables, click on 'PATH' and add a path to the \bin file for java
				example:
					C:\...\Java\jdk-23\bin

	open the ide command terminal, and run the command: npm install @mui/icons-material
	
	
	
To run the application:
	Open IDE, and navigate to the sbafrontent folder
		run the command: npm start

	run the NewbillingsystemApplication.java file in the IDE


Contributors:
  Jeremy Marks,
	Patrick Lee,
	Aaron Nguyen,
	Austin Silva
