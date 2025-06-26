using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;

namespace Bupa.OnlineServices.FunctionalTest
{
    public class Driver
    {
        public static IWebDriver Instance{get; set;}

        public static void Initialize()
        {
            Instance = new ChromeDriver();
            Instance.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
        }

        public static void Destroy()
        {
            Instance.Close();
            Instance.Dispose();
        }

    }
}
