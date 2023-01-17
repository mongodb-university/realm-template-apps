using RealmTodo.Services;

namespace RealmTodo;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        RealmService.Init();

        MainPage = new AppShell();
    }
}