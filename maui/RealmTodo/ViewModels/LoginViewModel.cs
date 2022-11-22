using System;
using System.Diagnostics;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace RealmTodo.ViewModels
{
    public partial class LoginViewModel : BaseViewModel
    {
        [RelayCommand]
        public void TestMethod()
        {
            Debug.WriteLine("TEST");
        }

        public string Title => "Tes";
    }
}

