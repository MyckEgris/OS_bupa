// ===================================================================================================================
// Author                : Mariana Alzate. 
// Product               : Bupa.OnlineServices.FuntionalTest
// Summary               : ClaimsSubmission Page Object.
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
using System.Diagnostics;
using System.Threading;

namespace Bupa.OnlineServices.FunctionalTest.page_objects

{
    class ClaimsSubmissionPage
    {
        

        /// <summary>
        /// Claims Online Page
        /// </summary>
        public void ClaimsOnlinePage()
        { 
            By mnmClaimsOnline = By.CssSelector("#page-top > app-root > app-layout > section.container-fluid > article > article.ig-header.order-2 > app-header > nav > div > ul > li > a > div > i");
            Driver.Instance.FindElement(mnmClaimsOnline).Click();
            
        }


        /// <summary>
        /// Online claims Agreement
        /// </summary>
        public void Onlineclaimsagreement()
        {
            By rtbOnlineclaimsAgreement = By.XPath("//ngb-modal-window/div/div/app-agreements/div[3]");
            By btnAceptarOnlineclaimsAgreement = By.CssSelector(".btn.btn-primary");
            Driver.Instance.FindElement(rtbOnlineclaimsAgreement).Click();
            Driver.Instance.FindElement(btnAceptarOnlineclaimsAgreement).Click();
        }


        ///<sumary>
        /// Clicks on Decline Buttom of Online claims Agreemen by using selenium web driver.
        /// </summary>

        public void Decline()
        {
            By btnDecline = By.CssSelector(".btn.btn-default");
            Driver.Instance.FindElement(btnDecline).Click();
        }

        /// <summary>
        /// Field Service Data
        /// </summary>
        public string ServiceData
        {
            set
            {
               
                By dpServiceData = By.XPath("//div/form/div[1]/div/app-custom-date-picker/div/div/input[2]");
                Driver.Instance.FindElement(dpServiceData).Click();
                Driver.Instance.FindElement(dpServiceData).SendKeys(value);
            }
        }

        ///<sumary>
        /// field Policy Number
        /// </summary>

        public string PolicyNumber
        {
            set
            {
                By txtPolicyNumber = By.Id("inputPoliza");
                Driver.Instance.FindElement(txtPolicyNumber).SendKeys(value);
            }
        }


        ///<sumary>
        /// Clicks on Search Buttom by using selenium web driver.
        /// </summary>

        public void Search()
        {
                By btnSearch = By.CssSelector(".btn.btn-primary.mb-2");
                Driver.Instance.FindElement(btnSearch).Click();
        }

        ///<sumary>
        /// Clicks on select member by using selenium web driver.
        /// </summary>

        public void SelectMember()
        {
            By rdbSelectMember = By.XPath("//div/div[1]/div/div/label");
            Driver.Instance.FindElement(rdbSelectMember).Click();
        }

        ///<sumary>
        /// Clicks on proceed with claim Buttom by using selenium web driver.
        /// </summary>

        public void ProceedwithClaim()
        {

                By btnProceedwithClaim = By.CssSelector(".btn.btn-primary.btnsiguiente.btn-lg.pull-right.ig-netx");
                Driver.Instance.FindElement(btnProceedwithClaim).Click();
        }

       
        ///<sumary>
        /// add valid files in step two
        /// </summary>
        public void AddValidFiles()
        {
            By btnselectfiles = By.XPath("//div/div[1]/div[3]/span/span[2]");
            Driver.Instance.FindElement(btnselectfiles).Click();
            ProcessStartInfo info = new ProcessStartInfo();

            info.UseShellExecute = true;
            info.FileName = "FileUpload.exe";
            //info.WorkingDirectory = "C:\\Projects\\Digital\\OnlineServices\\Dev\\Sprint8\\test\\FunctionalTest\\OnlineServices.FunctionalTest\\DataSet\\";
            info.WorkingDirectory = ConfigurationManager.AppSettings["dataPath"];

            Process.Start(info);
        }

        ///<sumary>
        /// add Invalid files in step two
        /// </summary>
        public void AddInvalidFiles()
        {
            By btnselectfiles = By.XPath("//div/div[1]/div[3]/span/span[2]");
            Driver.Instance.FindElement(btnselectfiles).Click();
            
            ProcessStartInfo info = new ProcessStartInfo();

            //info.UseShellExecute = true;
            info.FileName = "FileUploadko.exe";
            info.WorkingDirectory = ConfigurationManager.AppSettings["dataPath"];

            Process.Start(info);
            
        }


        ///<sumary>
        /// add XML files in step two
        /// </summary>
        public void AddXmlFiles()
        {
            By btnselectfiles = By.XPath("//div/div[1]/div[3]/span/span[2]");
            Driver.Instance.FindElement(btnselectfiles).Click();

            Thread.Sleep(TimeSpan.FromSeconds(10));
            ProcessStartInfo info = new ProcessStartInfo();

            //info.UseShellExecute = true;
            info.FileName = "FileUploadxml.exe";
            info.WorkingDirectory = ConfigurationManager.AppSettings["dataPath"];

            Process.Start(info);
            Thread.Sleep(TimeSpan.FromSeconds(10));
        }


        ///<sumary>
        /// add Word files in step two
        /// </summary>
        public void AddWordFiles()
        {
            By btnselectfiles = By.XPath("//div/div[1]/div[3]/span/span[2]");
            Driver.Instance.FindElement(btnselectfiles).Click();

            //Thread.Sleep(TimeSpan.FromSeconds(10));
            ProcessStartInfo info = new ProcessStartInfo();

            info.UseShellExecute = true;
            info.FileName = "FileUploadword.exe";
            info.WorkingDirectory = ConfigurationManager.AppSettings["dataPath"];

            Process.Start(info);
            //Thread.Sleep(TimeSpan.FromSeconds(10));
        }


        ///<sumary>
        /// Clicks on ok Buttom in message Maximum file size allowed.
        /// </summary>

        public void MessajeMaximumfile()
        {
            By btnok = By.XPath("//ngb-modal-window/div/div/app-notification/div[3]/button");
            Driver.Instance.FindElement(btnok).Click();
        }

        ///<sumary>
        /// Clicks on Send Claim Buttom by using selenium web driver.
        /// </summary>

        public void SendClaim()
        {
            By btnSenclaim = By.CssSelector(".btn.btn-primary.btnsiguiente.btn-lg.pull-right");
            Driver.Instance.FindElement(btnSenclaim).Click();
        }
       


        ///<sumary>
        /// Clicks on new Claim Buttom by using selenium web driver.
        /// </summary>

        public void NewClaim()
        {
            By btnNewclaim = By.XPath("//ngb-modal-window/div/div/app-notification/div[3]/button[2]");
            Driver.Instance.FindElement(btnNewclaim).Click();
        }
        
        public string GetTitle()
        {
            var h4 = Driver.Instance.FindElements(By.TagName("h4"));
            return h4[0].Text;
        }

        ///<sumary>
        /// Clicks on Update Claim Buttom by using selenium web driver.
        /// </summary>

        public void UpdateClaim()
        {
            By btnUpdateclaim = By.CssSelector("#page-top > ngb-modal-window > div > div > app-notification > div.modal-footer > button.btn.btn-primary");
            Driver.Instance.FindElement(btnUpdateclaim).Click();
        }



        ///<sumary>
        /// Clicks on Exit Buttom of modal claim sent
        /// </summary>

        public void ExitClaim()
        {
            By btnExitclaim = By.CssSelector("#page-top > ngb-modal-window > div > div > app-notification > div.modal-footer > button.btn.btn-default");
            Driver.Instance.FindElement(btnExitclaim).Click();
        }

        

        ///<sumary>
        /// Clicks on delete Buttom in step two:add documents
        /// </summary>

        public void Deletedocuments()
        {
            By btnDeletedocuments = By.CssSelector("#step-2 > div > div.ig-upfile > div.ig-file-scroll > div > div.ig-icofile > a > i");
            Driver.Instance.FindElement(btnDeletedocuments).Click();
        }

        ///<sumary>
        /// Clicks on delete Buttom in step two:add documents
        /// </summary>

        public void DeleteAlldocuments()
        {
            By btnDeleteAlldocuments = By.CssSelector("#step-2 > div > div.ig-upfile > div.ig-upfileitem > div > div.col-md-3.offset-md-3.text-right > a > i");
            By btnRemove = By.CssSelector("#page-top > ngb-modal-window > div > div > app-notification > div.modal-footer > button.btn.btn-primary");
            Driver.Instance.FindElement(btnDeleteAlldocuments).Click();
            Driver.Instance.FindElement(btnRemove).Click();
        }

        ///<sumary>
        /// Clicks on Ok Buttom in step two: Files already loaded.
        /// </summary>

        public void FilesAlreadyLoaded()
        {
            By btnFilesAlreadyLoaded = By.CssSelector("#page-top > ngb-modal-window > div > div > app-notification > div.modal-footer > button");
            Driver.Instance.FindElement(btnFilesAlreadyLoaded).Click();
        }


        ///<sumary>
        /// Clicks on Ok Buttom in step two: Not allowed file types.
        /// </summary>

        public void NotAllowedFileTypes()
        {
            By btnNotAllowedFileType = By.CssSelector("#page-top > ngb-modal-window > div > div > app-notification > div.modal-footer > button");
            Driver.Instance.FindElement(btnNotAllowedFileType).Click();
        }



        ///<sumary>
        /// Assertion to validate when not select a member and Proceed with claim button
        /// </summary>
        public string AssertionNoSelectMember()
        {
            var h5 = Driver.Instance.FindElements(By.TagName("h5"));
            return h5[0].Text;
        }


        ///<sumary>
        /// Assertion to validate when not attach documents
        /// </summary>


        public string AssertionNotattachdocuments()
        {
            var h6 = Driver.Instance.FindElements(By.XPath("//div/div[1]/div[1]/div/div[1]/p"));
            return h6[0].Text; 
        }

      
        ///<sumary>
        /// Assertion to validate when xml file pending
        /// </summary>


        public string AssertionNotattachXml()
        {
            var h4 = Driver.Instance.FindElements(By.TagName("h4"));
            return h4[0].Text;

            By btnAceptarmessage = By.CssSelector(".btn.btn-primary");
            Driver.Instance.FindElement(btnAceptarmessage).Click();
        }

        ///<sumary>
        /// Assertion to validate when No results were found.
        /// </summary>


        public string AssertionNoResults()
        {
            var h6 = Driver.Instance.FindElements(By.CssSelector("#step-1 > div > div.ig-resulsearchnone > p"));
            return h6[0].Text;
        }
    }
}
