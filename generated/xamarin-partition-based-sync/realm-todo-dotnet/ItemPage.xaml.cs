using System;
using System.Linq;
using RealmTemplateApp.Models;
using Realms;
using Xamarin.Forms;
using Realms.Sync;
using System.Collections.Generic;
using Realms.Sync.Exceptions;

namespace RealmTemplateApp
{
    public partial class ItemPage : ContentPage
    {
        private Realm itemsRealm;
        private User user;
        private IEnumerable<Item> _items;

        public ItemPage()
        {
            InitializeComponent();
            user = App.RealmApp.CurrentUser;
            var config = new PartitionSyncConfiguration(user.Id.ToString(), user);
            itemsRealm = Realm.GetInstance(config);
            config.OnSessionError = (sender, e) =>
            {
                //handle errors here
            };
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            try
            {
                SetUpItemsList();
            }
            catch (Exception ex)
            {
                await DisplayAlert("Error Fetching Items", ex.Message, "OK");
            }
        }

        private void SetUpItemsList()
        {
            if (_items == null)
            {
                _items = itemsRealm.All<Item>();
            }

            listItems.ItemsSource = _items;
        }

        private async void New_Button_Clicked(object sender, EventArgs e)
        {
            string result = await DisplayPromptAsync("New Item", "Enter the Item Name");

            if (result == null)
            {
                return;
            }

            var newItem = new Item()
            {
                Partition = user.Id.ToString(),
                Summary = result,
                IsComplete = false
            };

            itemsRealm.Write(() =>
            {
                itemsRealm.Add(newItem);
            });
        }

        private async void Logout_Clicked(object sender, EventArgs e)
        {
            // Ensure the realm is closed when the user logs out
            itemsRealm.Dispose();
            await App.RealmApp.CurrentUser.LogOutAsync();

            var root = Navigation.NavigationStack.First();
            if (!(root is LoginPage))
            {
                // The app started with user alerady logged in,
                // so we skipped the login page initially. We
                // now need it, so we create it.
                var loginPage = new LoginPage();
                NavigationPage.SetHasBackButton(loginPage, false);
                Navigation.InsertPageBefore(loginPage, root);
            }
            await Navigation.PopToRootAsync();
        }

        private async void Delete_Clicked(object sender, EventArgs e)
        {
            var itemToDelete = (e as TappedEventArgs).Parameter as Item;
            var result = await DisplayAlert("Delete Item",
                $"Are you sure you want to delete \"{itemToDelete.Summary}\"?",
                "Yes", "No");

            if (result == false)
            {
                return;
            };

            itemsRealm.Write(() =>
            {
                itemsRealm.Remove(itemToDelete);
            });
        }

        /// <summary>
        /// Handle Sync errors that might occur. This is only a subset
        /// of possible errors. See Realms.Sync.Exceptions.ErrorCode
        /// for the complete enumeration.
        /// </summary>
        /// <returns></returns>
        static EventHandler<ErrorEventArgs> SessionErrorHandler()
        {
            return (session, errorArgs) =>
            {
                var sessionException = (SessionException)errorArgs.Exception;
                switch (sessionException.ErrorCode)
                {
                    case ErrorCode.AccessTokenExpired:
                    case ErrorCode.BadUserAuthentication:
                        // Ask user for credentials
                        break;
                    case ErrorCode.PermissionDenied:
                        // Tell the user they don't have permissions to work with that Realm
                        break;
                    default:
                        // We have another error. Check the application log for
                        // details and/or add another `case` statement.
                        break;
                }
            };
        }
    }
}
