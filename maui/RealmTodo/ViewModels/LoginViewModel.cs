using System;
using System.Diagnostics;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RealmTodo.Services;
using RealmTodo.Views;

namespace RealmTodo.ViewModels
{
    public partial class LoginViewModel : BaseViewModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        [RelayCommand]
        public void OnAppearing()
        {
            Debug.WriteLine("OnAppearing");
        }

        [RelayCommand]
        public async void Login()
        {
            await VeryifyEmailAndPassword();
            await GoToMainPage();

        }

        [RelayCommand]
        public async void SignUp()
        {
            await VeryifyEmailAndPassword();
            await GoToMainPage();
        }

        private async Task VeryifyEmailAndPassword()
        {
            if (string.IsNullOrEmpty(Email) || string.IsNullOrEmpty(Password))
            {
                await DialogService.ShowAlertAsync("Login failed", "Please specify both the email and the password", "Ok");
            }
        }

        private async Task GoToMainPage()
        {
            await Shell.Current.GoToAsync($"//{nameof(ItemsPage)}");
        }

    }
}

