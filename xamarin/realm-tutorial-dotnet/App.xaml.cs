using Xamarin.Forms;
using System.IO;
using System.Xml;
using System;

namespace RealmTemplateApp
{
    public partial class App : Application
    {
        private string appId;
        public static Realms.Sync.App RealmApp;

        public App()
        {
            InitializeComponent();
        }

        protected override void OnStart()
        {
            try
            {
                appId = GetAppId();
                RealmApp = Realms.Sync.App.Create(appId);

                var navPage = App.RealmApp.CurrentUser == null ?
                    new NavigationPage(new LoginPage()) :
                    new NavigationPage(new TaskPage());

                NavigationPage.SetHasBackButton(navPage, false);
                MainPage = navPage;
            }
            catch (NullReferenceException nre)
            {
                // A NullReferenceException occurs if:
                // 1. the config file does not exist, or
                // 2. the config does not contain an "app-id" element.

                // If the app-id value is incorrect, we handle that
                // in the Login page.
            }
        }

        private string GetAppId()
        {
            using (Stream stream = this.GetType().Assembly.
               GetManifestResourceStream("RealmTemplateApp." + "app-config.xml"))
            {
                XmlDocument xmlDocument = new XmlDocument();
                xmlDocument.Load(stream);
                return xmlDocument.GetElementsByTagName("app-id")[0].InnerText;
            }
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}
