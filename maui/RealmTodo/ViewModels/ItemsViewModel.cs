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
            await realm.WriteAsync(() =>
            {
                realm.RemoveAll<Item>();
            });
        }

        [RelayCommand]
        public async Task AddItem()
        {
            var promptResult = await DialogService.ShowPromptAsync("New item");

            if (!string.IsNullOrEmpty(promptResult))
            {
                await realm.WriteAsync(() =>
                {
                    var item = new Item() { OwnerId = currentUserId, IsComplete = false, Summary = promptResult };
                    realm.Add(item);
                });
            }
        }

        [RelayCommand]
        public async Task EditItem(Item item)
        {
            var promptResult = await DialogService.ShowPromptAsync("Edit item", item.Summary);

            if (!string.IsNullOrEmpty(promptResult))
            {
                await realm.WriteAsync(() =>
                {
                    item.Summary = promptResult;
                });
            }
        }

        [RelayCommand]
        public async Task DeleteItem(Item item)
        {
            await realm.WriteAsync(() =>
            {
                realm.Remove(item);
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

