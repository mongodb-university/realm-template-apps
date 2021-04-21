﻿using System;
using AsyncTask = System.Threading.Tasks.Task;
using Realms.Sync;
using Xamarin.Forms;

namespace RealmTemplateApp
{
    public partial class LoginPage : ContentPage
    {
        private string email;
        private string password;
        private bool isLoggingIn;

        public LoginPage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            txtEmail.Text = "";
            txtPassword.Text = "";
            isLoggingIn = false;
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
            User user;
            if (App.RealmApp.CurrentUser == null)
            {
                try
                {
                    user = await App.RealmApp.LogInAsync(Credentials.EmailPassword(email, password));
                }
                catch (Exception ex)
                {
                    await DisplayAlert("Login Failed", ex.Message, "OK");
                }
            }

            var taskPage = new TaskPage();
            NavigationPage.SetHasBackButton(taskPage, false);
            await Navigation.PushAsync(taskPage);
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
                label.FontSize = 16;
                main_button.Text = "Create a New Account";
                label.Text = "Already have an account? Log In";
            }
        }

    }
}
