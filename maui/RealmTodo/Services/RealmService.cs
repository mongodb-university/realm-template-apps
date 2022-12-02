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

        public static async Task<Realm> GetRealmAsync()
        {
            var config = new FlexibleSyncConfiguration(App.CurrentUser);
            return await Realm.GetInstanceAsync(config);
        }

        public static Realm GetRealm()
        {
            var config = new FlexibleSyncConfiguration(App.CurrentUser);
            return Realm.GetInstance(config);
        }
    }
}

