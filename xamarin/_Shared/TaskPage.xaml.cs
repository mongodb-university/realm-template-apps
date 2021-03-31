using System;
using System.Collections.ObjectModel;
using System.Linq;
using RealmTemplateApp.Models;
using Realms;
using Xamarin.Forms;
using System.ComponentModel;
using Realms.Sync;
using System.Collections.Generic;

namespace RealmTemplateApp
{
    public partial class TaskPage : ContentPage
    {
        private Realm taskRealm;
        private User user;
        private IEnumerable<Task> _tasks;

        public TaskPage()
        {
            InitializeComponent();
            user = App.RealmApp.CurrentUser;
            var config = new SyncConfiguration(user.Id.ToString(), user);
            taskRealm = Realm.GetInstance(config);
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            WaitingLayout.IsVisible = true;
            try
            {
                SetUpTaskList();
            }
            catch (Exception ex)
            {
                await DisplayAlert("Error Fetching Tasks", ex.Message, "OK");
            }
        }

        private void SetUpTaskList()
        {
            if (_tasks == null || _tasks.Count() == 0)
            {
                WaitingLayout.IsVisible = true;
                _tasks = taskRealm.All<Task>();
                listTasks.ItemsSource = _tasks;
                WaitingLayout.IsVisible = false;
            }
        }

        async void New_Button_Clicked(object sender, EventArgs e)
        {
            string result = await DisplayPromptAsync("New Task", "Enter the Task Name");

            if (result == null)
            {
                return;
            }

            var newTask = new Task()
            {
                Partition = user.Id.ToString(),
                Summary = result,
                IsComplete = false
            };

            taskRealm.Write(() =>
            {
                taskRealm.Add(newTask);
            });
        }

        void chkCompleted_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            var isCompleteSwitch = (Switch)sender;
            var changedTask = _tasks.FirstOrDefault(t => t.Id == isCompleteSwitch.AutomationId);
            if (changedTask != null && e.PropertyName == "IsToggled")
            {
                taskRealm.Write(() =>
                    {
                        changedTask.IsComplete = isCompleteSwitch.IsToggled;
                    });
            }
        }

        async void Logout_Clicked(object sender, EventArgs e)
        {
            await App.RealmApp.CurrentUser.LogOutAsync();
            if (Navigation.NavigationStack.Count == 1)
            {
                var loginPage = new LoginPage();
                NavigationPage.SetHasBackButton(loginPage, false);
                await Navigation.PushAsync(loginPage);
            }
            else
            {
                await Navigation.PopToRootAsync();
            }
        }

        async void Delete_Clicked(object sender, EventArgs e)
        {
            var taskToDelete = (e as TappedEventArgs).Parameter as Task;
            var result = await DisplayAlert("Delete Task",
                $"Are you sure you want to delete \"{taskToDelete.Summary}\"?",
                "Yes", "No");

            if (result == false) return;

            taskRealm.Write(() =>
            {
                taskRealm.Remove(taskToDelete);
            });
        }

        void chkCompleted_Toggled(object sender, ToggledEventArgs e)
        {
            var isCompleteSwitch = (Switch)sender;
            var changedTask = _tasks.FirstOrDefault(t => t.Id == isCompleteSwitch.AutomationId);
        }
    }
}
