using System;
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
    }
}

