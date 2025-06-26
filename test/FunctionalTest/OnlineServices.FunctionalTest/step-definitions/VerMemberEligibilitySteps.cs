using System;
using TechTalk.SpecFlow;
using Bupa.OnlineServices.FunctionalTest.page_objects;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Bupa.OnlineServices.FunctionalTest.shared_objects;

namespace Bupa.OnlineServices.FunctionalTest
{
    [Binding, Scope(Tag = "VerificationMemberEligibility", Feature = "VerificationMemberEligibility")]
    public class VerificationMemberEligibilitySteps
    {
        private LoginPage _loginPage;
        private VerificationMemberEligibility _VerificationMemberEligibility;

        [Given(@"I am on the Eligility  page")]
        public void GivenIAmOnTheEligilityPage()
        {
            _loginPage = LoginPage.NavigateTo();
            Thread.Sleep(TimeSpan.FromSeconds(5));
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(5));
            _VerificationMemberEligibility = new VerificationMemberEligibility();
            _VerificationMemberEligibility.ElegibilityPage();
        }
        

        [When(@"I insert (.*) and (.*)")]
        public void WhenIInsertPolicyIdAndDateOfBirth(string policyId, string birthData)
        {
            _VerificationMemberEligibility.PolicyId = policyId;
            _VerificationMemberEligibility.Birthdate = birthData;
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _VerificationMemberEligibility.Search();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }


        [When(@"I select the option searched by the policy")]
        public void WhenISelectTheOptionSearchedByThePolicy()
        {
            _VerificationMemberEligibility.SearchMemberTypeByPolicy();
        }

        [Given(@"I text (.*) and (.*)")]
        public void GivenITextAnd(string policyId, string birthData)
        {
            _loginPage = LoginPage.NavigateTo();
            Thread.Sleep(TimeSpan.FromSeconds(5));
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(5));
            _VerificationMemberEligibility = new VerificationMemberEligibility();
            _VerificationMemberEligibility.ElegibilityPage();
            Thread.Sleep(TimeSpan.FromSeconds(10));
            _VerificationMemberEligibility.SearchMemberTypeByPolicy();
            _VerificationMemberEligibility.PolicyId = policyId;
            _VerificationMemberEligibility.Birthdate = birthData;
            _VerificationMemberEligibility.Search();
        }


        [When(@"I register (.*) and (.*) and (.*)")]
        public void WhenIRegisterAndAnd(string FirstName, string LastName, string birthData)
        {
            Thread.Sleep(TimeSpan.FromSeconds(10));
            _VerificationMemberEligibility.FirstName = FirstName;
            _VerificationMemberEligibility.LastName = LastName;
            _VerificationMemberEligibility.Birthdate = birthData;
            
        
        }

        
        [Then(@"I must see a message (.*)")]
        public void ThenIMustSeeAMessage(string message)
        {
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _VerificationMemberEligibility.VerifyElegibility();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [When(@"I select the option searched by member")]
        public void WhenISelectTheOptionSearchedByMember()
        {
            _VerificationMemberEligibility.SearchMemberTypeByMember();
        }

       
        
        [When(@"I click on the Login button verify Elegibility")]
        public void WhenIClickOnTheLoginButtonVerifyElegibility()
        {
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _VerificationMemberEligibility.VerifyElegibility();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [Then(@"I should see the Eligibility verification document")]
        public void ThenIShouldSeeTheEligibilityVerificationDocument()
        {

            _VerificationMemberEligibility.VerifyElegibility();
        }

        [Then(@"I must see an error (.*)")]
        public void ThenIMustSeeAnError(string message)
        {
            Thread.Sleep(TimeSpan.FromSeconds(1));
            var errorText = _VerificationMemberEligibility.GetErrorText();
            var actual = "Resultado de la búsqueda";
            Assert.AreEqual(actual, errorText);
        }

        [When(@"the Policy Number does not exist")]
        public void WhenThePolicyNumberDoesNotExist()
        {
        }

        [When(@"the Date of Birth does not exist")]
        public void WhenTheDateOfBirthDoesNotExist()
        {
        }



    }
}
