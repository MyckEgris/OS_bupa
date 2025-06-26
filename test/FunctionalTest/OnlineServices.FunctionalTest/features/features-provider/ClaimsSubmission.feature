Feature: ClaimsSubmission
	I need to make claims
	As a provider user
	I want to make claims by accepting content associated with the terms and conditions


@ClaimsSubmission
Scenario: Validate online claims agreement
	Given I need to make claims
	When  I am on the Claims Online page
	Then  the system must show the contents associated with the terms and conditions


@ClaimsSubmission
Scenario: To decline the online claims agreement
Given I am on the Claims Online page
When I'm decline the terms and conditions the online claims agreement.
Then the system should redirect back to home page

	
@ClaimsSubmission
Scenario Outline: STEP 1 - POLICY INFORMATION successfully completed
	Given I am on the Claims Online page
	And I have already accepted the terms and conditions
	When I insert Date of service received <servidata> and Polycy Number <policynumber>
	And I click on the search button
	Then Allow to select a member and  proceed with claim
	 

Examples:
| servidata    | policynumber   | 
| 12-11-2018   | 100            | 

@ClaimsSubmission
Scenario Outline: STEP 1 - POLICY INFORMATION: policy does not exist
	Given I am on the Claims Online page
	And I have already accepted the terms and conditions
	When I insert Date of service received <servidata> and Polycy Number <policynumber>
	 But the policy does not exist
	And I click on the search button
	Then I must see a message No se han encontrado resultados para tu busqueda.

Examples:
| servidata  | policynumber     | 
| 12-11-2018   | 19             | 


@ClaimsSubmission
Scenario Outline: STEP 1: POLICY INFORMATION No member is selected
	Given I am on the Claims Online page
	And I have already accepted the terms and conditions
	When I insert Date of service received <servidata> and Polycy Number <policynumber>
	And I click on the search button
	 But I do not select a member
	Then the Proceed with claim button is not enabled in step one
	

Examples:
| servidata    | policynumber   | 
| 12-11-2018   | 79             | 

@ClaimsSubmission
Scenario: STEP 2 - ADD DOCUMENTATION successfully completed
	Given I am on the step dos add documentation the Claims Online page
	When I added a valid file: pdf of diez MB 
	Then the system should allow me to continue to step tres
	
@ClaimsSubmission
Scenario: STEP 2 - ADD DOCUMENTATION: invalid files
	Given I am on the step dos add documentation the Claims Online page
	When I added a invalid file: pdf of once MB 
	Then I must view a message cargue el tipo de archivo apropiado

@ClaimsSubmission
Scenario: STEP 2 - ADD DOCUMENTATION: Do not attach documents
	Given I am on the step dos add documentation the Claims Online page
	But I did NOT add a file
	Then the Proceed with claim button is not enabled in step two

@ClaimsSubmission
Scenario: STEP 2 - ADD DOCUMENTATION: Delete an added file
	Given I am on the step dos add documentation the Claims Online page
	When I added a valid file: pdf of diez MB
	And  I delete the added file
	Then the Proceed with claim button is not enabled in step two

@ClaimsSubmission
Scenario: STEP 2 - ADD DOCUMENTATION: Delete all added files
	Given I am on the step dos add documentation the Claims Online page
	When I added a valid file: pdf of diez MB
	And  I delete all added files
	Then the Proceed with claim button is not enabled in step two

@ClaimsSubmission
Scenario: STEP 2 - ADD DOCUMENTATION: Validate duplicate files
	Given I am on the step dos add documentation the Claims Online page
	When I added a valid file: pdf of diez MB
	 But The file was previously added
	Then I must see a modal with a message el archivo es duplicado




@ClaimsSubmission
Scenario: STEP 3 - SUMMARY AND PRESENTATION: Claim New sent successfully
	Given I am on the step tres summary and presentation the Claims Online page
	When I click on the submit button
	And  Select the option New claim
	Then I must see a modal with a message la información se envió con éxito\.Su número de confirmación es	 
	

@ClaimsSubmission
Scenario: STEP 3 - SUMMARY AND PRESENTATION: Mexican claim submit without xml file
	Given I am in the summary of step three and I have entered a policy of mexico
	 But  I have not added an xml file
	When I click on the submit button
	Then I must see a modal with a message La Factura en formato XML es requerida y no ha sido enviada. Favor verificar



