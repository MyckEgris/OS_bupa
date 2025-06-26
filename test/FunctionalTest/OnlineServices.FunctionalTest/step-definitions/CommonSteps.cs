using System;
using TechTalk.SpecFlow;
using Bupa.OnlineServices.FunctionalTest.page_objects;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Bupa.OnlineServices.FunctionalTest.step_definitions
{
    [Binding]
    class CommonSteps
    {
        private LoginPage _loginPage;
        private HomePage _homePage;

        [Given(@"I am on the ""(.*)""")]
        public void GivenIAmOnThe(string url)
        {
            Driver.Instance.Navigate().GoToUrl(url);
            Driver.Instance.Manage().Window.Maximize();
        }


    }
}
