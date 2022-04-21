using Xamarin.Forms;
using System.IO;
using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics;

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
                LoadAppConfiguration();
                // :state-start: partition-based-sync
                var appConfiguration = new Realms.Sync.AppConfiguration(appId)
                {
                    BaseUri = new Uri(baseUrl)
                };
                RealmApp = Realms.Sync.App.Create(appConfiguration);
                // :state-end:
                // :state-uncomment-start: flexible-sync
                // RealmApp = Realms.Sync.App.Create(appId);
                // :state-uncomment-end:flexible-sync
                var navPage = RealmApp.CurrentUser == null ?
                    new NavigationPage(new LoginPage()) :
                    new NavigationPage(new TaskPage());

                NavigationPage.SetHasBackButton(navPage, false);
                MainPage = navPage;
            }
            catch (Exception ex)
            {
                // A Exception occurs if:
                // 1. the config file does not exist, or
                // 2. the config does not contain an "appId" or "baseUrl" element.

                // If the appId value is incorrect, we handle that
                // exception in the Login page.

                Debug.WriteLine(ex.ToString());
            }
        }

        private void LoadAppConfiguration()
        {
            try
            {
                using (Stream stream = this.GetType().Assembly.
                   GetManifestResourceStream("RealmTemplateApp." + "realm.json"))
                using (StreamReader reader = new StreamReader(stream))
                {
                    var json = reader.ReadToEnd();
                    var parsedJson = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
                    appId = parsedJson["appId"];
                    baseUrl = parsedJson["baseUrl"];
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error has occurred: {ex.Message}.");
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
