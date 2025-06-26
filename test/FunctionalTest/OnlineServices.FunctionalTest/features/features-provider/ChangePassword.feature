Feature: ChangePassword
	As any user
	I need to change my password in order to access the online services
	In order to re establish or secure the integrity of my password.

@ignore @ChangePassword
Scenario Outline: Successful password change
	Given I am on the Change Password page
	And I enter <Currentpassword> and <Newpassword> and <Confirmnewpassword> 
	When I click on the Save Button 
	Then You should see a message El cambio de contraseña fué exitoso
	
	Examples:
| Currentpassword   | Newpassword    | Confirmnewpassword  |
|  Bupa2222!        | Bupa2018?      | Bupa2018?           |

@ignore @ChangePassword	
Scenario Outline: new password equals current password
	Given I have entered the password change page
	And I enter <Currentpassword> and <Newpassword> and <Confirmnewpassword>  
		But new password equals current password
	When I click on the Save Button 
	Then You should see a message La nueva contraseña no debe ser igual a la contraseña actual.
	
	Examples:
| Currentpassword   | Newpassword    | Confirmnewpassword  |
|  Bupa2018?        | Bupa2018?      | Bupa2018?           |
	
@ignore  @ChangePassword
Scenario Outline: New password does not match password confirmed
	Given I have entered the password change page
	And I enter <Currentpassword> and <Newpassword> and <Confirmnewpassword> 
		But New password does not match password confirmed
	Then You should see a message Por favor revise la contraseña. La contraseña no coincide.
	
	Examples:
| Currentpassword   | Newpassword   | Confirmnewpassword  |
|   Bupa2018?       |  Bupa2222?    |  Bupa2222!          |

@ignore @ChangePassword
Scenario Outline: The new password does not comply with the format
	Given I have entered the password change page
    And I enter <Currentpassword> and <Newpassword> and <Confirmnewpassword> 
		But The new password does not contain a special character
	Then You should see a message Por favor ingrese la contraseña de acuerdo a los formatos establecidos. 
	
	Examples:
| Currentpassword   | Newpassword   | Confirmnewpassword |
|   Bupa2018?       |  Bupa2018     |  Bupa2018           |

		
@ignore @ChangePassword
Scenario Outline: use of previous passwords
	Given I have entered the password change page
	And I enter <Currentpassword> and <Newpassword> and <Confirmnewpassword>  
		But a previously used password is indicated
	When I click on the Save Button 
	Then You should see a message El cambio de contraseña fué exitoso
	
	Examples:
| Currentpassword   | Newpassword    | Confirmnewpassword  |
|   Bupa2018?       |  Bupa2222!     |  Bupa2222!          |