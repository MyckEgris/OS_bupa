// ===================================================================================================================
// Author                : Mairana Alzate. 
// Product               : Bupa.OnlineServices.FuntionalTest
// Summary               : Login Page Object.
// Framework Version     : 4.5
// Company               : Bupa
// ===================================================================================================================
// <copyright file="LoginPage.cs" company="Bupa">
//      Copyright (C) 2018 Bupa
// </copyright>
// ===================================================================================================================

using OpenQA.Selenium;
using System.Configuration;

namespace Bupa.OnlineServices.FunctionalTest.page_objects
{
    public class LoginPage
    {
        /// <summary>
        /// Login Url.
        /// </summary>
        public static string pageUri = ConfigurationManager.AppSettings.Get("homeUrl");

        /// <summary>
        /// Login User Name.
        /// </summary>
        public string UserName
        {
            set
            {
                Driver.Instance.FindElement(By.Id("User")).SendKeys(value);
            }
        }

        /// <summary>
        /// Login Password.
        /// </summary>
        public string Password
        {
            set
            {
                Driver.Instance.FindElement(By.Id("Password")).SendKeys(value);
            }
        }

        /// <summary>
        /// Navigates to Login Page by using Selenium Web Driver.
        /// </summary>
        /// <returns></returns>
        public static LoginPage NavigateTo()
        {
            Driver.Instance.Navigate().GoToUrl(pageUri);
            Driver.Instance.Manage().Window.Maximize();
            return new LoginPage();
        }

        /// <summary>
        /// Gets Login Page error message.
        /// </summary>
        /// <returns></returns>
        public string GetErrorText()
        {
            var li = Driver.Instance.FindElements(By.XPath("/html/body/section[1]/article[2]/div/form/div[5]/div/ul/li"));
            return li[0].Text;
        }

        /// <summary>
        /// Clicks on Login Buttom by using selenium web driver.
        /// </summary>
        public void Login()
        {
            IWebElement element = Driver.Instance.FindElement(By.CssSelector(".btn.btn-primary.btn-block.btnprincipal"));
            element.Click();
        }
    }
}
