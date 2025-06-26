Feature: VerificationMemberEligibility
	Verification of member eligibility
	in order to access the information of the members of a policy
	As a provider user
	I want to validate the eligibility of members associated with a policy

@ignore
Scenario Outline: Successful search for policy
	Given I am on the Eligility  page
	When I select the option searched by the policy
	And I insert <policy> and <dob>
    Then I must see a message Verificación de elegibilidad · VOE

Examples:
| policy         | dob            |
| 222558         | 02-04-1940     |

  @ignore @VerificationMemberEligibility
Scenario Outline: Successful search for member
	Given I am on the Eligility  page
	When I select the option searched by member
	And I register <firstname> and <lastname> and <dob>
	Then I must see a message Verificación de elegibilidad · VOE

Examples:
| firstname    | lastname           | dob         |
| ASIRB        | QDER WWHLEAVWAB    | 02-04-1940  |

@ignore @VerificationMemberEligibility
Scenario Outline: Search by number of policy not existing
	Given I am on the Eligility  page
	When I select the option searched by the policy
	And I insert <policy> and <dob>
	   But the Policy Number does not exist 
	Then I must see an error  En este momento no podemos verificar la elegibilidad del asegurado. Por favor contacte con BGLA vía email usamed@bupalatinamerica.com o llame al +1 305 275 1500 para obtener más información.

Examples:
| policy         | dob            |
| 22257899    | 04-02-1940     |

@ignore @VerificationMemberEligibility
Scenario Outline: Search by date of birth Does not correspond to the registered one
	Given I am on the Eligility  page
	When I select the option searched by the policy
	And I insert <policy> and <dob>
	   But the Date of Birth does not exist 
	Then I must see an error  En este momento no podemos verificar la elegibilidad del asegurado. Por favor contacte con BGLA vía email usamed@bupalatinamerica.com o llame al +1 305 275 1500 para obtener más información.


Examples:
| policy         | dob            |
| 222558         | 07-01-1986     |

@ignore @VerificationMemberEligibility
Scenario Outline: Access document eligibility verification
	Given I text <policy> and <dob>
	When I click on the Login button verify Elegibility
	Then I should see the Eligibility verification document

Examples:
| policy         | dob            |
| 222558         | 02-04-1940     |

