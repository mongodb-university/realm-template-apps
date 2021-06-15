using Xamarin.Forms;
using System.IO;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace RealmTemplateApp
{
    public partial class App : Application
    {
        private string appId;
        private string baseUrl;
        public static Realms.Sync.App RealmApp;

        public App()
        {
            InitializeComponent();
        }

        protected override void OnStart()
        {
            try
            {
                var appConfiguration = LoadAppConfiguration();
                RealmApp = Realms.Sync.App.Create(appConfiguration);

                var navPage = App.RealmApp.CurrentUser == null ?
                    new NavigationPage(new LoginPage()) :
                    new NavigationPage(new TaskPage());

                NavigationPage.SetHasBackButton(navPage, false);
                MainPage = navPage;
            }
            catch (Exception e)
            {
                // A NullReferenceException occurs if:
                // 1. the config file does not exist, or
                // 2. the config does not contain an "app_id" or "base_url" element.

                // If the app_id value is incorrect, we handle that
                // exception in the Login page.

                throw e;
            }
        }

        private Realms.Sync.AppConfiguration LoadAppConfiguration()
        {
            using (Stream stream = this.GetType().Assembly.
               GetManifestResourceStream("RealmTemplateApp." + "realm.json"))
            using (StreamReader reader = new StreamReader(stream))
            {
                var json = reader.ReadToEnd();
                var parsedJson = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
                appId = parsedJson["app_id"];
                baseUrl = parsedJson["base_url"];
                var appConfiguration = new Realms.Sync.AppConfiguration(appId)
                {
                    BaseUri = new Uri(baseUrl)
                };
                return appConfiguration;
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
