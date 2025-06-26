// ===================================================================================================================
// Author                : Mariana Alzate. 
// Product               : Bupa.OnlineServices.FuntionalTest
// Summary               : VerificationMemberEligibility Page Object.
// Framework Version     : 4.5
// Company               : Bupa
// ===================================================================================================================
// <copyright file="VerificationMemberEligibility.cs" company="Bupa">
//      Copyright (C) 2018 Bupa
// </copyright>
// ===================================================================================================================
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium;
using System.Configuration;
using OpenQA.Selenium.Support.UI;


namespace Bupa.OnlineServices.FunctionalTest.page_objects
{
    public class VerificationMemberEligibility
    {

        /// <summary>
        /// Elegibility Page
        /// </summary>
        public void ElegibilityPage()
        {
            By mnmElegibility = By.Id("nav1");
            Driver.Instance.FindElement(mnmElegibility).Click();
        }

        /// <summary>
        /// SearchMemberTypeByPolicy
        /// </summary>
        public void SearchMemberTypeByPolicy()
        { 
                var searchMemberType = Driver.Instance.FindElement(By.Id("searchMemberType"));
                var selectElement = new SelectElement(searchMemberType);
                selectElement.SelectByValue("by_policy");      
        }


        /// <summary>
        /// SearchMemberTypeByMember
        /// </summary>
        public void SearchMemberTypeByMember()
        {
                var searchMemberType = Driver.Instance.FindElement(By.Id("searchMemberType"));
                var selectElement = new SelectElement(searchMemberType);
                selectElement.SelectByValue("by_member");     
        }


        /// <summary>
        /// Field PolicyId
        /// </summary>
        public string PolicyId
        {
            set
            {
                By txtPolicyId = By.Id("policyId");
                Driver.Instance.FindElement(txtPolicyId).SendKeys(value);
            }
        }


        /// <summary>
        /// Field Birthdate
        /// </summary>
        public string Birthdate
        {
            set

            {
                By dpBirthdate = By.XPath ("//app-custom-date-picker/div/div/input[2]");
                                            
                //By dpBirthdate = By.XPath("//app-root/app-layout/section/article[2]/div/app-member-elegibility/section/form/div[1]/div/div/div/div[3]/app-custom-date-picker/div/div/input[2]");
                By btnCalendar = By.XPath("//app-custom-date-picker/div/div/div/button/i");
                                           
                Driver.Instance.FindElement(dpBirthdate).Click();
                Driver.Instance.FindElement(dpBirthdate).SendKeys(value);
                Driver.Instance.FindElement(btnCalendar).Click();
                Driver.Instance.FindElement(btnCalendar).Click();
                Driver.Instance.FindElement(btnCalendar).Submit();

            }
        }

        /// <summary>
        /// Field FirstName
        /// </summary>
        public string FirstName
        {
            set
            {
                By txtFirstName = By.Id("firstName");
                Driver.Instance.FindElement(txtFirstName).SendKeys(value);
            }
        }


        /// <summary>
        /// Field LastName
        /// </summary>
        public string LastName
        {
            set
            {
                By txtLastName = By.Id("lastName");
                Driver.Instance.FindElement(txtLastName).SendKeys(value);
            }
        }

        /// <summary>
        /// Clicks on Search Buttom by using selenium web driver.
        /// </summary>
        public void Search()
        {
           
            By btnSearch = By.XPath("//app-root/app-layout/section/article/div/app-member-elegibility/section/form/div[1]/div/div/div/div[4]/button/i");
            Driver.Instance.FindElement(btnSearch).Click();     
        }


        /// <summary>
        /// Clicks on VerifyElegibility Buttom by using selenium web driver.
        /// </summary>
        public void VerifyElegibility()
        {
            By btnVerifyElegibility = By.CssSelector("#page-top > app-root > app-layout > section > article > div > app-member-elegibility > section > form > div.ig-reclamosconte > div > div > div > div > div > div:nth-child(5) > a");
            Driver.Instance.FindElement(btnVerifyElegibility).Click();
        }



        /// <summary>
        /// Clicks on print Buttom by using selenium web driver.
        /// </summary>
        public void Print()
        {
            By btnPrint = By.CssSelector(".btn.btn-print");
            Driver.Instance.FindElement(btnPrint).Click();   
        }


        /// <summary>
        /// Clicks on close Buttom by using selenium web driver.
        /// </summary>
        public void close()
        {
            By btnClose = By.XPath("//app-root/app-member-verification-eligibility/section/article/div[1]/div/div/div[2]/a");
            Driver.Instance.FindElement(btnClose).Click();
        }

        /// <summary>
        /// Gets VerificationMemberEligibility Page error message.
        /// </summary>
        /// <returns></returns>
        public string GetErrorText()
        {
            var li = Driver.Instance.FindElements(By.TagName("h4"));
            return li[0].Text;
        }

        public string GetTitle()
        {
            var h4 = Driver.Instance.FindElements(By.XPath("//app-root/app-layout/section/article/div/app-member-elegibility/section/form/div[2]/div/div/div/div/div/div[1]/p"));
            return h4[0].Text;
        }
    }
}
