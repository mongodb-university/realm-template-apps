using System;
using System.Threading.Tasks;

namespace RealmTodo.Services
{
    public static class DialogService
    {
        public static Task ShowAlertAsync(string title, string message, string accept)
        {
            return Application.Current.MainPage.DisplayAlert(title, message, accept);
        }

        public static Task<string> ShowPromptAsync(string title, string initialValue = "")
        {
            return Application.Current.MainPage.DisplayPromptAsync(title, "", initialValue: initialValue);
        }
    }
}

