using System;
using AsyncTask = System.Threading.Tasks.Task;
using Realms.Sync;
using Xamarin.Forms;

namespace RealmTemplateApp
{
    public partial class LoginPage : ContentPage
    {
        private string email;
        private string password;
        private bool isLoggingIn = false;

        public LoginPage()
        {
            InitializeComponent();
        }

        private async void Main_Button_Clicked(object sender, EventArgs e)
        {
            if (isLoggingIn)
            {
                await DoLogin();
            }
            else
            {
                await RegisterUser();
            }
        }

        private async AsyncTask DoLogin()
        {
            try
            {
                await App.RealmApp.LogInAsync(Credentials.EmailPassword(email, password));
                var itemPage = new ItemPage();
                NavigationPage.SetHasBackButton(itemPage, false);
                await Navigation.PushAsync(itemPage);
            }
            catch (Exception ex)
            {
                await DisplayAlert("Login Failed", ex.Message, "OK");
            }
        }

        private async AsyncTask RegisterUser()
        {
            try
            {
                await App.RealmApp.EmailPasswordAuth.RegisterUserAsync(email, password);
                await DoLogin();
            }
            catch (Exception ex)
            {
                await DisplayAlert("Registration Failed", ex.Message, "OK");
            }
        }

        private void Email_Entry_Completed(object sender, EventArgs e)
        {
            email = ((Entry)sender).Text;
        }

        private void Password_Entry_Completed(object sender, EventArgs e)
        {
            password = ((Entry)sender).Text;
        }

        private void Switcher_Tapped(object sender, EventArgs e)
        {
            isLoggingIn = !isLoggingIn;
            var label = (Label)sender;
            if (isLoggingIn)
            {
                label.FontSize = 14;
                main_button.Text = "Log In";
                label.Text = "Don't have an account? Create One";
            }
            else
            {
                label.FontSize = 14;
                main_button.Text = "Create a New Account";
                label.Text = "Already have an account? Log In";
            }
        }

    }
}
