// ===================================================================================================================
// Author                : Mariana Alzate. 
// Product               : Bupa.OnlineServices.FuntionalTest
// Summary               : ViewClaims Page Object.
// Framework Version     : 4.5
// Company               : Bupa
// ===================================================================================================================
// <copyright file="ViewClaims.cs" company="Bupa">
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
    class ViewClaimsPage
    {

        /// <summary>
        /// My Claims Page
        /// </summary>
        public void MyClaimsPage()
        {
            By mnmMyClaims = By.Id("nav0");
            Driver.Instance.FindElement(mnmMyClaims).Click();   
        }


        /// <summary>
        ///  selected Claim Type incomplete
        /// </summary>
        public void selectedClaimTypeByincomplete()
        {
                var selectedClaimType = Driver.Instance.FindElement(By.Id("selectedClaimType"));
                var selectElement = new SelectElement(selectedClaimType);
                selectElement.SelectByValue("incomplete");
            
        }


        /// <summary>
        ///  selected Claim Type pending
        /// </summary>
        public void selectedClaimTypeBypending()
        {
                var selectedClaimType = Driver.Instance.FindElement(By.Id("selectedClaimType"));
                var selectElement = new SelectElement(selectedClaimType);
                selectElement.SelectByValue("pending");
        }


        /// <summary>
        ///  selected Claim Type processed
        /// </summary>
        public void selectedClaimTypeByprocessed()
        {
                var selectedClaimType = Driver.Instance.FindElement(By.Id("selectedClaimType"));
                var selectElement = new SelectElement(selectedClaimType);
                selectElement.SelectByValue("processed");
        }


        /// <summary>
        /// field claimant Name
        /// </summary>
        public string ClaimantName
        {
            set
            {

                By txtClaimantName = By.Id("claimantName");
                Driver.Instance.FindElement(txtClaimantName).SendKeys(value);
            }
        }


        /// <summary>
        /// Datepicker My claims
        /// </summary>
        public string DatepickerMyclaims
        {
            set
            {
                By DatepickerMyclaims = By.XPath("//app-root/app-layout/section/article[2]/div/app-claim-view-container/section/form/div[1]/div/div/div/div[3]/app-custom-date-picker-from-to/div/div/input");
                By btnCalendar = By.XPath("//app-root/app-layout/section/article[2]/div/app-claim-view-container/section/form/div[1]/div/div/div/div[3]/app-custom-date-picker-from-to/div/div/div[1]/button/i");
                Driver.Instance.FindElement(DatepickerMyclaims).Click();
                Driver.Instance.FindElement(DatepickerMyclaims).SendKeys(value);
                Driver.Instance.FindElement(btnCalendar).Click();
                Driver.Instance.FindElement(btnCalendar).Click();
            }
        }

        /// <summary>
        /// Clicks on Search Buttom by using selenium web driver.
        /// </summary>
        public void Search()
        {
                By btnSearch = By.CssSelector("#page-top > app-root > app-layout > section.container-fluid > article > article.ig-contenido.order-3 > div > app-claim-view-container > section > form > div.row > div > div > div.row.align-items-bottom > div > div > div > div > div:nth-child(4) > button > i");
                Driver.Instance.FindElement(btnSearch).Click();
           
        }

        /// <summary>
        /// Clicks on EOB Link by using selenium web driver.
        /// </summary>
        public void EOBLink()
        {
            By lnkEOB = By.CssSelector("//app-root/app-layout/section/article[2]/div/app-claim-view-container/section/form/div[2]/div/div/div/app-claim-view-incomplete/div/div[2]/div[2]/div/div[4]/a ");
            Driver.Instance.FindElement(lnkEOB).Click();

        }

       
    }
}
