using System;
using Realms;
using Realms.Sync;

namespace RealmTodo.Services
{
    public static class RealmService
    {
        private const string appId = "";

        public static Realms.Sync.App App;

        public static void Init()
        {
            App = Realms.Sync.App.Create(appId);
        }

        public static void GetRealm()
        {
            var config = new FlexibleSyncConfiguration(App.CurrentUser);
            var realm = Realm.GetInstance(config);
        }
    }
}

