using System;
using TechTalk.SpecFlow;
using Bupa.OnlineServices.FunctionalTest.page_objects;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Bupa.OnlineServices.FunctionalTest.shared_objects;

namespace Bupa.OnlineServices.FunctionalTest.step_definitions
{
    [Binding, Scope(Tag = "ChangePassword", Feature = "ChangePassword")]

    public class ChangePasswordSteps
    {

        private LoginPage _loginPage;
        private ChangePasswordPage _ChangePasswordPage;


        [Given(@"I am on the Change Password page")]
        public void GivenIAmOnTheChangePasswordPage()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ChangePasswordPage = new ChangePasswordPage();
            _ChangePasswordPage.ClaimsOnlinePage();
        }

        [Given(@"I have entered the password change page")]
        public void GivenIHaveEnteredThePasswordChangePage()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = "lalzate@bupalatinamerica.com";
            _loginPage.Password = "Bupa2018?";
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ChangePasswordPage = new ChangePasswordPage();
            _ChangePasswordPage.ClaimsOnlinePage();
        }



        [Given(@"I enter (.*) and (.*) and (.*)")]
        public void GivenIEnterCurrentpasswordAndNewpasswordAndConfirmnewpassword( string Currentpassword, string Newpassword, string Confirmnewpassword)
        {
            _ChangePasswordPage.Currentpassword = Currentpassword;
            _ChangePasswordPage.Newpassword = Newpassword;
            _ChangePasswordPage.Confirmnewpassword = Confirmnewpassword;
        }
        


       [When(@"I click on the Save Button")]
        public void WhenIClickOnTheSaveButton()
        {
            _ChangePasswordPage.Save();
        }

        [Given(@"new password equals current password")]
        public void GivenNewPasswordEqualsCurrentPassword()
        {  
        }

        [Given(@"New password does not match password confirmed")]
        public void GivenNewPasswordDoesNotMatchPasswordConfirmed()
        {
        }
 
        
        [Given(@"The new password does not contain a special character")]
        public void GivenTheNewPasswordDoesNotContainASpecialCharacter()
        {
        }
        
  
        [Given(@"a previously used password is indicated")]
        public void GivenAPreviouslyUsedPasswordIsIndicated()
        {
        }
        
        [Then(@"You should see a message El cambio de contraseña fué exitoso")]
        public void ThenYouShouldSeeAMessageElCambioDeContrasenaFueExitoso()
        {
            _ChangePasswordPage.Assertionsuccessfulpasswordchange();
        }
        
        [Then(@"You should see a message La nueva contraseña no debe ser igual a la contraseña actual\.")]
        public void ThenYouShouldSeeAMessageLaNuevaContrasenaNoDebeSerIgualALaContrasenaActual_()
        {
            _ChangePasswordPage.Assertionsuccessfulpasswordchange();
        }
        
        [Then(@"You should see a message Por favor revise la contraseña\. La contraseña no coincide\.")]
        public void ThenYouShouldSeeAMessagePorFavorReviseLaContrasena_LaContrasenaNoCoincide_()
        {
            Thread.Sleep(TimeSpan.FromSeconds(1));
            var message = _ChangePasswordPage.AssertionPassworddoesnotmatch();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            Assert.AreEqual(false, message == "Por favor revise la contraseña. La contraseña no coincide.");
        }
        
        [Then(@"You should see a message Por favor ingrese la contraseña de acuerdo a los formatos establecidos\.")]
        public void ThenYouShouldSeeAMessagePorFavorIngreseLaContrasenaDeAcuerdoALosFormatosEstablecidos_()
        {
            Thread.Sleep(TimeSpan.FromSeconds(1));
            var message = _ChangePasswordPage.Assertioninvalidformat();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            Assert.AreEqual(true, message == "Por favor ingrese la contraseña de acuerdo a los formatos establecidos.");
        }
    }
}
