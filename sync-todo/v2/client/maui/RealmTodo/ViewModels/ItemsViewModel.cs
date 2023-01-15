using System;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RealmTodo.Models;
using RealmTodo.Services;
using Realms;
using Realms.Sync;

namespace RealmTodo.ViewModels
{
    public partial class ItemsViewModel : BaseViewModel
    {
        [ObservableProperty]
        private string connectionStatusIcon = "wifi_on.png";

        [ObservableProperty]
        private bool isShowAllTasks;

        [ObservableProperty]
        private IQueryable<Item> items;

        [ObservableProperty]
        private string newItemSummary;

        [ObservableProperty]
        private string dialogTitle;

        private Realm realm;
        private string currentUserId;
        private bool isOnline = true;

        [RelayCommand]
        public void OnAppearing()
        {
            realm = RealmService.GetMainThreadRealm();
            currentUserId = RealmService.CurrentUser.Id;
            Items = realm.All<Item>().OrderBy(i => i.Id);

            var currentSubscriptionType = RealmService.GetCurrentSubscriptionType(realm);
            IsShowAllTasks = currentSubscriptionType == SubscriptionType.All;
        }

        [RelayCommand]
        public async Task Logout()
        {
            IsBusy = true;
            await RealmService.LogoutAsync();
            IsBusy = false;

            await Shell.Current.GoToAsync($"//login");
        }

        [RelayCommand]
        public async Task AddItem()
        {
            var promptResult = await DialogService.ShowPromptAsync("New item");

            NewItemSummary = String.Empty;

            DialogTitle = "Add New Item";
            var newItemResult = await DialogService.ShowPromptAsync(newItem, this);

            if (newItemResult)
            {
                newItem.Summary = NewItemSummary;

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
            if (!await CheckItemOwnership(item))
            {
                return;
            }
            NewItemSummary = item.Summary;

            DialogTitle = "Edit Item";
            var editedItemResult = await DialogService.ShowPromptAsync(item, this);
            if (editedItemResult)
            {
                await realm.WriteAsync(() =>
                {
                    item.Summary = NewItemSummary;
                });
            }
        }

        [RelayCommand]
        public async Task DeleteItem(Item item)
        {
            if (!await CheckItemOwnership(item))
            {
                return;
            }

            await realm.WriteAsync(() =>
            {
                realm.Remove(item);
            });
        }

        [RelayCommand]
        public void ChangeConnectionStatus()
        {
            isOnline = !isOnline;

            if (isOnline)
            {
                realm.SyncSession.Start();
            }
            else
            {
                realm.SyncSession.Stop();
            }

            ConnectionStatusIcon = isOnline ? "wifi_on.png" : "wifi_off.png";
        }

        private async Task<bool> CheckItemOwnership(Item item)
        {
            if (!item.IsMine)
            {
                await DialogService.ShowAlertAsync("Error", "You cannot modify items not belonging to you", "OK");
                return false;
            }

            return true;
        }

        async partial void OnIsShowAllTasksChanged(bool value)
        {
            await RealmService.SetSubscription(realm, value ? SubscriptionType.All : SubscriptionType.Mine);

            if (!isOnline)
            {
                await DialogService.ShowToast("Switching subscriptions does not affect Realm data when the sync is offline.");
            }
        }
    }
}

