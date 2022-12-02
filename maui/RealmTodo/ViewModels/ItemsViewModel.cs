using System;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RealmTodo.Models;
using RealmTodo.Services;
using Realms;

namespace RealmTodo.ViewModels
{
    public partial class ItemsViewModel : BaseViewModel
    {
        [ObservableProperty]
        private string connectionStatusIcon = "wifi_on.png";

        private Realm realm;
        private string currentUserId;

        public IQueryable<Item> Items { get; set; }

        [RelayCommand]
        public async Task OnAppearing()
        {
            realm = await RealmService.GetRealmAsync();
            currentUserId = RealmService.App.CurrentUser.Id;
            Items = realm.All<Item>();
            OnPropertyChanged(nameof(Items));

            if (realm.Subscriptions.Count == 0)
            {
                await ChangeSubscription(SubscriptionType.Mine);
            }
        }

        [RelayCommand]
        public async Task Logout()
        {

        }

        [RelayCommand]
        public async Task AddItem()
        {
            await realm.WriteAsync(() =>
            {
                var item = new Item() { OwnerId = currentUserId, IsComplete = false, Summary = "Test" };
                realm.Add(item);
            });
        }

        [RelayCommand]
        public async Task ChangeConnectionStatus()
        {
            ConnectionStatusIcon = "wifi_on.png";
            OnPropertyChanged(nameof(Items));
        }

        private async Task ChangeSubscription(SubscriptionType subType)
        {
            realm.Subscriptions.Update(() =>
            {
                realm.Subscriptions.RemoveAll(true);

                IQueryable<Item> query = null;

                if (subType == SubscriptionType.Mine)
                {
                    query = realm.All<Item>().Where(i => i.OwnerId == currentUserId);
                }
                else
                {
                    query = realm.All<Item>();
                }

                realm.Subscriptions.Add(query);
            });

            await realm.Subscriptions.WaitForSynchronizationAsync();
        }

        private enum SubscriptionType
        {
            Mine,
            All,
        }
    }
}

