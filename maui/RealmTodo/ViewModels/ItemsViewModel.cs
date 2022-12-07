﻿using System;
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

        [ObservableProperty]
        private bool isShowAllTasks;

        [ObservableProperty]
        private IQueryable<Item> items;

        private Realm realm;
        private string currentUserId;
        private bool isOnline = true;

        [RelayCommand]
        public async Task OnAppearing()
        {
            realm = RealmService.GetRealm();
            currentUserId = RealmService.CurrentUserId;
            Items = realm.All<Item>();

            if (realm.Subscriptions.Count == 0)
            {
                await ChangeSubscription(SubscriptionType.Mine);
            }
        }

        [RelayCommand]
        public async Task Logout()
        {
            await RealmService.App.CurrentUser.LogOutAsync();

            await Shell.Current.GoToAsync($"//login");
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
            if (!await CheckItemOwnership(item))
            {
                return;
            }

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

        async partial void OnIsShowAllTasksChanged(bool value)
        {
            await ChangeSubscription(value ? SubscriptionType.All : SubscriptionType.Mine);
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

        private async Task<bool> CheckItemOwnership(Item item)
        {
            if (!item.IsMine)
            {
                await DialogService.ShowAlertAsync("Error", "You cannot modify items not belonging to you", "OK");
                return false;
            }

            return true;
        }

        private enum SubscriptionType
        {
            Mine,
            All,
        }
    }
}

