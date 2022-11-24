namespace RealmTodo;

public partial class App : Application
{
    public static Realms.Sync.App RealmApp;

    public App()
    {
        InitializeComponent();

        var appId = GetAppId();
        RealmApp = Realms.Sync.App.Create(appId);

        MainPage = new AppShell();
    }

    private string GetAppId()
    {

    }


}

