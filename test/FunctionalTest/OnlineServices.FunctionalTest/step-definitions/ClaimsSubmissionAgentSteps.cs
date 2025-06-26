using System;
using TechTalk.SpecFlow;
using Bupa.OnlineServices.FunctionalTest.page_objects;
using System.Threading;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Bupa.OnlineServices.FunctionalTest.shared_objects;


namespace Bupa.OnlineServices.FunctionalTest.step_definitions
{
    [Binding, Scope(Tag = "ClaimsSubmissionAgent", Feature = "ClaimsSubmissionAgent")]

    public class ClaimsSubmissionAgentSteps
    {

        private LoginPage _loginPage;
        private ClaimsSubmissionPage _ClaimsSubmissionPage;

        [Given(@"I need to make claims")]
        public void GivenINeedToMakeClaims()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));

        }

        [Given(@"I am on the Claims Online page")]
        public void GivenIAmOnTheClaimsOnlinePage()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage = new ClaimsSubmissionPage();
            _ClaimsSubmissionPage.ClaimsOnlinePage();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [Given(@"I have already accepted the terms and conditions")]
        public void GivenIHaveAlreadyAcceptedTheTermsAndConditions()
        {
            _ClaimsSubmissionPage.Onlineclaimsagreement();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [Given(@"I am on the step dos add documentation the Claims Online page")]
        public void GivenIAmOnTheStepDosAddDocumentationTheClaimsOnlinePage()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage = new ClaimsSubmissionPage();
            _ClaimsSubmissionPage.ClaimsOnlinePage();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.Onlineclaimsagreement();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.ServiceData = "12-11-2018";
            _ClaimsSubmissionPage.PolicyNumber = "100";
            _ClaimsSubmissionPage.Search();
            _ClaimsSubmissionPage.SelectMember();
            _ClaimsSubmissionPage.ProceedwithClaim();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [Given(@"I am on the step tres summary and presentation the Claims Online page")]
        public void GivenIAmOnTheStepTresSummaryAndPresentationTheClaimsOnlinePage()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName;
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage = new ClaimsSubmissionPage();
            _ClaimsSubmissionPage.ClaimsOnlinePage();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.Onlineclaimsagreement();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.ServiceData = "12-11-2018";
            _ClaimsSubmissionPage.PolicyNumber = "100";
            _ClaimsSubmissionPage.Search();
            _ClaimsSubmissionPage.SelectMember();
            _ClaimsSubmissionPage.ProceedwithClaim();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.AddValidFiles();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.ProceedwithClaim();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }

        [When(@"I am on the Claims Online page")]
        public void WhenIAmOnTheClaimsOnlinePage()
        {
            _ClaimsSubmissionPage = new ClaimsSubmissionPage();
            _ClaimsSubmissionPage.ClaimsOnlinePage();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [When(@"I insert Date of service received (.*) and Polycy Number (.*)")]
        public void WhenIInsertDateOfServiceReceivedAndPolycyNumber(string ServiceData, string PolicyNumber)
        {
            _ClaimsSubmissionPage.ServiceData = ServiceData;
            _ClaimsSubmissionPage.PolicyNumber = PolicyNumber;

        }

        [When(@"I click on the search button")]
        public void WhenIClickOnTheSearchButton()
        {
            _ClaimsSubmissionPage.Search();
        }

        [When(@"the policy does not exist")]
        public void WhenThePolicyDoesNotExist()
        {
        }

        [When(@"I added a valid file: pdf of diez MB")]
        public void WhenIAddedAValidFilePdfOfDiezMB()
        {
            _ClaimsSubmissionPage.AddValidFiles();
            Thread.Sleep(TimeSpan.FromSeconds(2));

        }

        [When(@"I added a invalid file: pdf of once MB")]
        public void WhenIAddedAInvalidFilePdfOfOnceMB()
        {
            _ClaimsSubmissionPage.AddInvalidFiles();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }


        [When(@"I click on the submit button")]
        public void WhenIClickOnTheSubmitButton()
        {
            _ClaimsSubmissionPage.SendClaim();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }

        [Then(@"the system must show the contents associated with the terms and conditions")]
        public void ThenTheSystemMustShowTheContentsAssociatedWithTheTermsAndConditions()
        {
            _ClaimsSubmissionPage.Onlineclaimsagreement();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }


        [Then(@"Allow to select a member and  proceed with claim")]
        public void ThenAllowToSelectAMemberAndProceedWithClaim()
        {
            _ClaimsSubmissionPage.SelectMember();
            _ClaimsSubmissionPage.ProceedwithClaim();
        }

        [Then(@"I must see a message No se han encontrado resultados para tu busqueda.")]
        public void ThenIMustSeeAMessageNoHayInformacionDisponibleParaEstaPoliza_()
        {
            Thread.Sleep(TimeSpan.FromSeconds(1));
            var errorText = _ClaimsSubmissionPage.AssertionNoResults();
            var actual = "No se han encontrado resultados para tu busqueda.";
            Assert.AreEqual(actual, errorText);
        }

        [Then(@"the system should allow me to continue to step tres")]
        public void ThenTheSystemShouldAllowMeToContinueToStepTres()
        {
            _ClaimsSubmissionPage.ProceedwithClaim();
        }


        [Then(@"I must view a message cargue el tipo de archivo apropiado")]
        public void ThenIMustViewAMessageCargueElTipoDeArchivoApropiado()
        {
            _ClaimsSubmissionPage.MessajeMaximumfile();
        }

        [Then(@"I must see a modal with a message la información se envió con éxito\\\.Su número de confirmación es")]
        public void ThenIMustSeeAModalWithAMessageLaInformacionSeEnvioConExito_SuNumeroDeConfirmacionEs()
        {
            _ClaimsSubmissionPage.ExitClaim();
            Thread.Sleep(TimeSpan.FromSeconds(10));
        }


        [When(@"I'm decline the terms and conditions the online claims agreement\.")]
        public void WhenIMDeclineTheTermsAndConditionsTheOnlineClaimsAgreement_()
        {
            _ClaimsSubmissionPage.Decline();
        }


        [Then(@"the system should redirect back to home page")]
        public void ThenTheSystemShouldRedirectBackToHomePage()
        {
            _ClaimsSubmissionPage = new ClaimsSubmissionPage();
            var title = _ClaimsSubmissionPage.GetTitle();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            Assert.AreEqual(true, title.Contains("Te has conectado con rol Provider"));
        }

        [When(@"I do not select a member")]
        public void WhenIDoNotSelectAMember()
        {
        }

        [Then(@"the Proceed with claim button is not enabled in step two")]
        public void ThenTheProceedWithClaimButtonIsNotEnabled()
        {
            _ClaimsSubmissionPage.ProceedwithClaim();
            Thread.Sleep(TimeSpan.FromSeconds(2));

            var title = _ClaimsSubmissionPage.AssertionNoSelectMember();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            var actual = "2. Añadir documentación";
            Assert.AreEqual(actual, title);
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [Then(@"the Proceed with claim button is not enabled in step one")]
        public void ThenTheProceedWithClaimButtonIsNotEnabledInStepOne()
        {
            _ClaimsSubmissionPage.ProceedwithClaim();
            Thread.Sleep(TimeSpan.FromSeconds(2));

            var title = _ClaimsSubmissionPage.AssertionNoSelectMember();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            var actual = "1. Fecha de Servicio";
            Assert.AreEqual(actual, title);
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }


        [Given(@"I did NOT add a file")]
        public void GivenIDidNOTAddAFile()
        {
        }


        [Given(@"I am in the summary of step three and I have entered a policy of mexico")]
        public void GivenIAmInTheSummaryOfStepThreeAndIHaveEnteredAPolicyOfMexico()
        {
            _loginPage = new LoginPage();
            _loginPage = LoginPage.NavigateTo();
            _loginPage.UserName = User.UserName; 
            _loginPage.Password = User.UserPassword;
            _loginPage.Login();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage = new ClaimsSubmissionPage();
            _ClaimsSubmissionPage.ClaimsOnlinePage();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.Onlineclaimsagreement();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.ServiceData = "12-11-2018";
            _ClaimsSubmissionPage.PolicyNumber = "190850";
            _ClaimsSubmissionPage.Search();
            _ClaimsSubmissionPage.SelectMember();
            _ClaimsSubmissionPage.ProceedwithClaim();
            Thread.Sleep(TimeSpan.FromSeconds(5));

        }

        [Given(@"I have not added an xml file")]
        public void GivenIHaveNotAddedAnXmlFile()
        {
            _ClaimsSubmissionPage.AddValidFiles();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            _ClaimsSubmissionPage.ProceedwithClaim();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }

        [Then(@"I must see a modal with a message La Factura en formato XML es requerida y no ha sido enviada\. Favor verificar")]
        public void ThenIMustSeeAModalWithAMessageLaFacturaEnFormatoXMLEsRequeridaYNoHaSidoEnviada_FavorVerificar()
        {
            Thread.Sleep(TimeSpan.FromSeconds(1));
            var errorText = _ClaimsSubmissionPage.AssertionNotattachXml();
            Thread.Sleep(TimeSpan.FromSeconds(2));
            Assert.AreEqual(true, errorText.Contains("Archivo Pendiente"));
        }


        [Given(@"I have added an xml file")]
        public void GivenIHaveAddedAnXmlFile()
        {
            _ClaimsSubmissionPage.AddXmlFiles();
            Thread.Sleep(TimeSpan.FromSeconds(10));
        }

        [When(@"Select the option update claim")]
        public void WhenSelectTheOptionUpdateClaim()
        {
            _ClaimsSubmissionPage.UpdateClaim();
            Thread.Sleep(TimeSpan.FromSeconds(2));
        }

        [When(@"Select the option New claim")]
        public void WhenSelectTheOptionNewClaim()
        {
            Thread.Sleep(TimeSpan.FromSeconds(5));
            _ClaimsSubmissionPage.NewClaim();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }

        [When(@"I delete the added file")]
        public void WhenIDeleteTheAddedFile()
        {
            _ClaimsSubmissionPage.Deletedocuments();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }

        [When(@"I delete all added files")]
        public void WhenIDeleteAllAddedFiles()
        {
            _ClaimsSubmissionPage.DeleteAlldocuments();
            Thread.Sleep(TimeSpan.FromSeconds(5));

        }
        [When(@"The file was previously added")]
        public void WhenTheFileWasPreviouslyAdded()
        {
            _ClaimsSubmissionPage.AddValidFiles();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }

        [Then(@"I must see a modal with a message el archivo es duplicado")]
        public void ThenIMustSeeAModalWithAMessageElArchivoEsDuplicado()
        {
            _ClaimsSubmissionPage.FilesAlreadyLoaded();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }

        [When(@"I added a invalid file: Word")]
        public void WhenIAddedAInvalidFileWord()
        {
            _ClaimsSubmissionPage.AddValidFiles();
            _ClaimsSubmissionPage.AddValidFiles();
            _ClaimsSubmissionPage.AddWordFiles();
            Thread.Sleep(TimeSpan.FromSeconds(5));
        }


        [Then(@"I must see a modal with a message Archivos no permitidos\. Cargue el tipo de archivo apropiado\.")]
        public void ThenIMustSeeAModalWithAMessageArchivosNoPermitidos_CargueElTipoDeArchivoApropiado_()
        {
            _ClaimsSubmissionPage.NotAllowedFileTypes();
            Thread.Sleep(TimeSpan.FromSeconds(5));

        }

    }
}
