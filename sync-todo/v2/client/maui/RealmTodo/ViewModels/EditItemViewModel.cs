using System;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RealmTodo.Models;
using RealmTodo.Services;

namespace RealmTodo.ViewModels
{
    public partial class EditItemViewModel : BaseViewModel, IQueryAttributable
    {
        [ObservableProperty]
        private Item newOrChangedItem;

        [ObservableProperty]
        private string dialogTitle;

        private Realms.Realm realm;
        private string currentUserId;

        public void ApplyQueryAttributes(IDictionary<string, object> query)
        {
            realm = RealmService.GetMainThreadRealm();
            currentUserId = RealmService.CurrentUser.Id;

            NewOrChangedItem = query["item"] as Item;


            if (NewOrChangedItem.OwnerId == null) //we're creating a new Item
            {
                NewOrChangedItem.OwnerId = currentUserId;
                DialogTitle = "Create a New Item";
            }
            else //we're editing an existing item
            {
                DialogTitle = $"Modify Item {NewOrChangedItem.Id}";
            }
        }

        [RelayCommand]
        public async Task SaveItem()
        {
            await realm.WriteAsync(() =>
            {
                realm.Add(newOrChangedItem);
            });

            await Shell.Current.GoToAsync($"//items");
        }

        [RelayCommand]
        public async Task Cancel()
        {
            await Shell.Current.GoToAsync($"//items");
        }
    }
}

