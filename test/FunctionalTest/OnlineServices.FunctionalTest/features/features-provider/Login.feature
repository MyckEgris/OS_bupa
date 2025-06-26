Feature: LogIn_Feature
	In order to access my account
    As a user of the website
    I want to log into the website

@Login 
Scenario Outline: Login failed with invalid credentials(username) 
	Given I am on the Welcome Page
	When I enter <username> and <password>
		But the user name does not exist  
	And I click on the Login button
	Then I should see an error El usuario o la contraseña no son válidos.

 Examples:
| username                      | password |
| lalzateserror@intergrupo.com  | 12345    |

@Login 
Scenario Outline: Login failed with invalid credentials(password)
	Given I am on the Welcome Page
	When I enter <username> and <password>
		But the password does not exist  
	And I click on the Login button
	Then I should see an error El usuario o la contraseña no son válidos.

 Examples:
| username                         | password   |
| pedrogonzales504@intergrupo.com  | upa2222!!  |
 
 @Login 
Scenario Outline: Successful Login with Valid Credentials
	Given I am on the Welcome Page
	When I enter <username> and <password>
	And I click on the Login button
	Then I should see a message Bienvenido
 
 Examples:
| username                         |   password    |
| pedrogonzales504@intergrupo.com  | Bupa2222!     |

@Login 
Scenario Outline: user disabled
	Given I am on the Welcome Page
	When I enter <username> and <password>
	And I click on the Login button
	Then I should see an error El usuario esta deshabilitado.
 
Examples:
| username                        | password     |
| amarrero@bupalatinamerica.com  |  Bupa2222!   |

@Login 
Scenario Outline: user not approved
	Given I am on the Welcome Page
	When I enter <username> and <password>
	And I click on the Login button
	Then I should see an error El usuario no está aprobado.
 
Examples:
| username                | password |
| jmunozf@intergrupo.com  | 12345    |

