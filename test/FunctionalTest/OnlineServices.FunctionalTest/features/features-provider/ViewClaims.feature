Feature: View Claims
	Access information about my claims
	As a provider user
	I want to validate claims that are incomplete, received and pending and processed
 
@ignore @ViewClaims
Scenario: Successful search of incomplete claims
	Given I am on the My Claims page
	When I select the option searched by Incomplete
    Then should see the claims records in incomplete

@ignore @ViewClaims
Scenario: Successful search of received and pending claims
	Given I am on the My Claims page
	When I select the option searched by received and pending
    Then should see the claims records in received and pending

@ignore @ViewClaims
Scenario: Successful search of processed claims
	Given I am on the My Claims page
	When I select the option searched by processed
    Then should see the claims records in processed

	
@ignore @ViewClaims	
Scenario: Search without records of incomplete claims
	Given I am on the My Claims page
	When I select the option searched by incomplete
		But There aren't records of incomplete claims.
    Then should see see a message no se encontraron registros.
 
@ignore @ViewClaims
Scenario Outline: search processed claims and claimant name
	Given I am on the My Claims page
	When I select the option searched by processed
	And I enter <claimantname>
	Then You should see the claim records in process for the claimant

Examples:
| claimantname  | 
| JOE           | 

@ignore @ViewClaims
Scenario: to access the EOB document
	Given that I want to access the EOB document
	When I click on the specific link
    Then the system should generate a PDF document showing all the details of the benefits or services associated with the assistance for the policy member

@ignore @ViewClaims
Scenario: validate option payment detail in processed claims
	Given that I want to access the payment detail option in a processed claim
	When I click on the specific link
    Then should see the payment detail information

