using System;
using TechTalk.SpecFlow;
using Bupa.OnlineServices.FunctionalTest.page_objects;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Bupa.OnlineServices.FunctionalTest.shared_objects;



namespace Bupa.OnlineServices.FunctionalTest.step_definitions
{
    [Binding, Scope(Tag = "ViewClaims", Feature = "View Claims")]
    public class ViewClaimsSteps
    {
        private LoginPage _loginPage;
        private ViewClaimsPage _ViewClaims;



        [Given(@"I am on the My Claims page")]
        public void GivenIAmOnTheMyClaimsPage()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ViewClaims = new ViewClaimsPage();
            _ViewClaims.MyClaimsPage();
        }
        
        
        [Given(@"that I want to access the EOB document")]
        public void GivenThatIWantToAccessTheEOBDocument()
        {
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            _ViewClaims.MyClaimsPage();
            _ViewClaims.selectedClaimTypeByprocessed();

        }
        
        [Given(@"that I want to access the payment detail option in a processed claim")]
        public void GivenThatIWantToAccessThePaymentDetailOptionInAProcessedClaim()
        {
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            _ViewClaims.MyClaimsPage();
            _ViewClaims.selectedClaimTypeByprocessed();
        }


     

        [When(@"I select the option searched by Incomplete")]
        public void WhenISelectTheOptionSearchedByIncomplete()
        {
            _ViewClaims.selectedClaimTypeByincomplete();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ViewClaims.Search();
        }


        [When(@"I select the option searched by received and pending")]
        public void WhenISelectTheOptionSearchedByReceivedAndPending()
        {
            _ViewClaims.selectedClaimTypeBypending();
        }
        
        [When(@"I select the option searched by processed")]
        public void WhenISelectTheOptionSearchedByProcessed()
        {
            _ViewClaims.selectedClaimTypeByprocessed();
        }
        
        
        [When(@"I enter (.*)")]
        public void WhenIEnterJOE(string claimantName)
        {
            _ViewClaims.ClaimantName = claimantName;
        }
        
        [When(@"I click on the specific link")]
        public void WhenIClickOnTheSpecificLink()
        {
            ScenarioContext.Current.Pending();
        }
        
        [Then(@"should see the claims records in incomplete")]
        public void ThenShouldSeeTheClaimsRecordsInIncomplete()
        {
            _ViewClaims.EOBLink();
        }
        
        [Then(@"should see the claims records in received and pending")]
        public void ThenShouldSeeTheClaimsRecordsInReceivedAndPending()
        {
            ScenarioContext.Current.Pending();
        }
        
        [Then(@"should see the claims records in processed")]
        public void ThenShouldSeeTheClaimsRecordsInProcessed()
        {
            ScenarioContext.Current.Pending();
        }
        
        [Then(@"should see see a message no se encontraron registros\.")]
        public void ThenShouldSeeSeeAMessageNoSeEncontraronRegistros_()
        {
            ScenarioContext.Current.Pending();
        }
        
        [Then(@"You should see the claim records in process for the claimant")]
        public void ThenYouShouldSeeTheClaimRecordsInProcessForTheClaimant()
        {
            ScenarioContext.Current.Pending();
        }
        
        [Then(@"the system should generate a PDF document showing all the details of the benefits or services associated with the assistance for the policy member")]
        public void ThenTheSystemShouldGenerateAPDFDocumentShowingAllTheDetailsOfTheBenefitsOrServicesAssociatedWithTheAssistanceForThePolicyMember()
        {
            ScenarioContext.Current.Pending();
        }
        
        [Then(@"should see the payment detail information")]
        public void ThenShouldSeeThePaymentDetailInformation()
        {
            ScenarioContext.Current.Pending();
        }


        [When(@"There aren't records of incomplete claims\.")]
        public void WhenThereArenTRecordsOfIncompleteClaims_()
        {
        }

    }
}
