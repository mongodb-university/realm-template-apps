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

        public LoginPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            txtEmail.Text = "";
            txtPassword.Text = "";
        }


        async void Login_Button_Clicked(object sender, EventArgs e)
        {
            await DoLogin();
        }

        private async AsyncTask DoLogin()
        {
            try
            {
                var user = await App.RealmApp.LogInAsync(Credentials.EmailPassword(email, password));
                if (user != null)
                {
                    var taskPage = new TaskPage();
                    NavigationPage.SetHasBackButton(taskPage, false);
                    await Navigation.PushAsync(taskPage);
                }
                else throw new Exception();
            }
            catch (Exception ex)
            {
                await DisplayAlert("Login Failed", ex.Message, "OK");
            }
        }
        async void Register_Button_CLicked(object sender, EventArgs e)
        {
            await RegisterUser();
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

        void Email_Entry_Completed(object sender, EventArgs e)
        {
            email = ((Entry)sender).Text;
        }

        void Password_Entry_Completed(object sender, EventArgs e)
        {
            password = ((Entry)sender).Text;
        }

    }
}
