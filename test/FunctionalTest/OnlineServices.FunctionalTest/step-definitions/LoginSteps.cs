using System;
using TechTalk.SpecFlow;
using Bupa.OnlineServices.FunctionalTest.page_objects;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Bupa.OnlineServices.FunctionalTest.step_definitions
{
    [Binding]
    public class LoginSteps
    {
        private LoginPage _loginPage;
        private HomePage _homePage;

        [Given(@"I am on the Welcome Page")]
        public void GivenUserIsOnTheWelcomePage()
        {
            _loginPage = LoginPage.NavigateTo();
        }

        [When(@"I enter (.*) and (.*)")]
        public void WhenUserEntersUserNameAndPasswrod(string username, string password)
        {
            Thread.Sleep(TimeSpan.FromSeconds(10));
            _loginPage.UserName = username;
            _loginPage.Password = password;
        }

        [When(@"I click on the Login button")]
        public void WhenClickOnTheLogInButton()
        {
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _loginPage.Login();

        }

        [Then(@"I should see a message (.*)")]
        public void ThenIShouldSeeAMessage(string message)
        {
            _homePage = new HomePage();
            var title = _homePage.GetTitle();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            Assert.AreEqual(true, title.Contains(message));
        }


        [When(@"the user name does not exist")]
        public void WhenTheUserNameDoesNotExist()
        {
        }

        [When(@"the password does not exist")]
        public void WhenThePasswordDoesNotExist()
        {
        }

        [Then(@"I should see an error (.*)")]
        public void ThenUserShouldSeeAnError(string message)
        {
            Thread.Sleep(TimeSpan.FromSeconds(1));
            var errorText = _loginPage.GetErrorText();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            Assert.AreEqual(true, errorText == message);
        }
    }
}
