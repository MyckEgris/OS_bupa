using Bupa.OnlineServices.FunctionalTest.shared_objects;
using System.Configuration;
using TechTalk.SpecFlow;

namespace Bupa.OnlineServices.FunctionalTest
{
    [Binding]
    public class ScenarioBeforeAndAfter
    {
        [BeforeScenario]
        public static void Before()
        {
            User.UserName = ConfigurationManager.AppSettings["providerUserName"];
            User.UserPassword = ConfigurationManager.AppSettings["providerPassword"];
            Driver.Initialize();
        }

        [AfterScenario]
        public static void After()
        {
            //Driver.Destroy();
            Driver.Instance.Quit();
        }

    }
}
