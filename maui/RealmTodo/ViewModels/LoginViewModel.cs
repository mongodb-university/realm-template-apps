using System;
using System.Diagnostics;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Realms.Sync;
using RealmTodo.Services;
using RealmTodo.Views;

namespace RealmTodo.ViewModels
{
    public partial class LoginViewModel : BaseViewModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        [RelayCommand]
        public async Task OnAppearing()
        {
            Debug.WriteLine("OnAppearing");

            if (RealmService.App.CurrentUser != null)
            {
                await GoToMainPage();
            }
        }

        [RelayCommand]
        public async Task Login()
        {
            if (!await VeryifyEmailAndPassword())
            {
                return;
            }

            await DoLogin();
        }

        [RelayCommand]
        public async Task SignUp()
        {
            if (!await VeryifyEmailAndPassword())
            {
                return;
            }

            await DoSignup();
        }

        private async Task DoLogin()
        {
            try
            {
                await RealmService.App.LogInAsync(Credentials.EmailPassword(Email, Password));
            }
            catch (Exception ex)
            {
                await DialogService.ShowAlertAsync("Login failed", ex.Message, "Ok");
                return;
            }

            await GoToMainPage();
        }

        private async Task DoSignup()
        {

            try
            {
                await RealmService.App.EmailPasswordAuth.RegisterUserAsync(Email, Password);
            }
            catch (Exception ex)
            {
                await DialogService.ShowAlertAsync("Sign up failed", ex.Message, "Ok");
                return;
            }

            await DoLogin();
        }

        private async Task<bool> VeryifyEmailAndPassword()
        {
            if (string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Password))
            {
                await DialogService.ShowAlertAsync("Error", "Please specify both the email and the password", "Ok");
                return false;
            }

            return true;
        }

        //TODO Possible improvements:
        // - Disable buttons when one is clicked
        // - Show activity indicator on login/signup

        private async Task GoToMainPage()
        {
            //TODO To remove! It was useful for testing
            //await DialogService.ShowAlertAsync("MAIN PAGE", "Please specify both the email and the password", "Ok");

            await Shell.Current.GoToAsync($"//{nameof(ItemsPage)}");
        }

    }
}

