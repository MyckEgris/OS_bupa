// ===================================================================================================================
// Author                : Mairana Alzate. 
// Product               : Bupa.OnlineServices.FuntionalTest
// Summary               : Home Page Object.
// Framework Version     : 4.5
// Company               : Bupa
// ===================================================================================================================
// <copyright file="HomePage.cs" company="Bupa">
//      Copyright (C) 2018 Bupa
// </copyright>
// ===================================================================================================================

using OpenQA.Selenium;

namespace Bupa.OnlineServices.FunctionalTest.page_objects
{
    public class HomePage
    {
        /// <summary>
        /// Gets Home Page Title by using Selenium Web Driver.
        /// </summary>
        /// <returns></returns>
        public string GetTitle()
        {
            var h5s = Driver.Instance.FindElements(By.TagName("h3"));
            return h5s[0].Text;
        }
    }
}
