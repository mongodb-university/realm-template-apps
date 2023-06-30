using RealmTodo.Services;

namespace RealmTodo;

public partial class App : Application
{
    public App()
    {
        InitializeComponent();

        MainPage = new AppShell();
    }
}