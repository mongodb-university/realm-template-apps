using System;
using Realms;
using Realms.Sync;

namespace RealmTodo.Services
{
    public static class RealmService
    {
        private const string appId = "todo-template-tldrx";

        private static Realms.Sync.App app;

        private static Realm mainThreadRealm;

        public static User CurrentUser => app.CurrentUser;

        public static void Init()
        {
            app = Realms.Sync.App.Create(appId);
        }

        public static Realm GetMainThreadRealm()
        {
            if (mainThreadRealm == null)
            {
                var config = new FlexibleSyncConfiguration(app.CurrentUser);
                mainThreadRealm = Realm.GetInstance(config);
            }

            return mainThreadRealm;
        }

        public static async Task RegisterAsync(string email, string password)
        {
            await app.EmailPasswordAuth.RegisterUserAsync(email, password);
        }

        public static async Task LoginAsync(string email, string password)
        {
            await app.LogInAsync(Credentials.EmailPassword(email, password));
        }

        public static async Task LogoutAsync()
        {
            await app.CurrentUser.LogOutAsync();
            mainThreadRealm?.Dispose();
            mainThreadRealm = null;
        }
    }
}

