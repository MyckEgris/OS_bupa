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
    class ChangePasswordPage
    {


        /// <summary>
        /// Change Password Page
        /// </summary>
        public void ClaimsOnlinePage()
        {
            By ddluser = By.Id("navbarDropdown");
            Driver.Instance.FindElement(ddluser).Click();

            By ddicambiocontraseña = By.CssSelector("#navbarSupportedContent > li.nav-item.dropdown.show > div > a:nth-child(2)");
            Driver.Instance.FindElement(ddicambiocontraseña).Click();
        }


        /// <summary>
        /// Field Current password
        /// </summary>
        public string Currentpassword
        {
            set
            {
                By txtCurrentpassword = By.Id("currentPwd");
                Driver.Instance.FindElement(txtCurrentpassword).SendKeys(value);
            }
        }


        /// <summary>
        /// Field New password
        /// </summary>
        public string Newpassword
        {
            set
            {
                By txtNewpassword = By.Id("newPwd");
                Driver.Instance.FindElement(txtNewpassword).SendKeys(value);
            }
        }


        /// <summary>
        /// Field Confirm new password
        /// </summary>
        public string Confirmnewpassword
        {
            set
            {
                By txtConfirmnewpassword = By.Id("confirmPwd");
                Driver.Instance.FindElement(txtConfirmnewpassword).SendKeys(value);
            }
        }

        /// <summary>
        /// Save Button
        /// </summary>
        public void Save()
        {
            By btnsave = By.CssSelector("#page-top > app-root > app-layout > section.container-fluid > article > article.ig-contenido.order-3 > div > app-change-password > section > article > article > div > form > div > div > div.row > button");
            Driver.Instance.FindElement(btnsave).Click();
        }


        ///<sumary>
        /// Assertion successful password change
        /// </summary>


        public void Assertionsuccessfulpasswordchange()
        {
            By btnokmodal = By.CssSelector("#page-top > ngb-modal-window > div > div > app-notification > div.modal-footer > button");
            Driver.Instance.FindElement(btnokmodal).Click();
        }

        ///<sumary>
        /// Assertion to validate when No results were found.
        /// </summary>


        public string Assertioninvalidformat()
        {
            var c4 = Driver.Instance.FindElements(By.XPath("//app-root/app-layout/section[2]/article/article[3]/div/app-change-password/section/article/article/div/form/div/div/div[2]/div[1]/span[1]/div"));
            return c4[0].Text;
        }



        ///<sumary>
        /// Assertion Password does not match.
        /// </summary>


        public string AssertionPassworddoesnotmatch()
        {
            var c5 = Driver.Instance.FindElements(By.XPath("//app-root/app-layout/section[2]/article/article[3]/div/app-change-password/section/article/article/div/form/div/div/div[2]/div[2]/div[2]"));
            return c5[0].Text;
        }
    }
}
   


