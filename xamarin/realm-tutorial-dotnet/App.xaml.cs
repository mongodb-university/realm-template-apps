using Xamarin.Forms;
using System.IO;
using System.Xml;

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
            appId = GetAppId();
            RealmApp = Realms.Sync.App.Create(appId);
            if (App.RealmApp.CurrentUser == null)
            {
                MainPage = new NavigationPage(new LoginPage());
            }
            else
            {
                MainPage = new NavigationPage(new ProjectPage());
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
