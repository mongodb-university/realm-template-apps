using System;
using System.Collections.ObjectModel;
using System.Linq;
using RealmTemplateApp.Models;
using Realms;
using Xamarin.Forms;
using System.ComponentModel;
using Realms.Sync;

namespace RealmTemplateApp
{
    public partial class TaskPage : ContentPage
    {
        private Realm taskRealm;
        private User user;
        private ObservableCollection<Task> _tasks = new ObservableCollection<Task>();

        public ObservableCollection<Task> MyTasks
        {
            get
            {
                return _tasks;
            }
        }

        public TaskPage()
        {
            InitializeComponent();
        }

        protected override async void OnAppearing()
        {
            user = App.RealmApp.CurrentUser;
            WaitingLayout.IsVisible = true;
            try
            {
                var config = new SyncConfiguration(user.Id.ToString(), user);
                taskRealm = await Realm.GetInstanceAsync(config);
                SetUpTaskList();
            }
            catch (Exception ex)
            {
                await DisplayAlert("Error Fetching Tasks", ex.Message, "OK");
            }
            base.OnAppearing();
        }

        private void SetUpTaskList()
        {
            if (_tasks != null || _tasks.Count == 0)
            {
                WaitingLayout.IsVisible = true;
                _tasks = new ObservableCollection<Task>(taskRealm.All<Task>().ToList());
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

            if (taskRealm == null)
            {
                taskRealm = await Realm.GetInstanceAsync();
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

            MyTasks.Add(newTask);
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
            if (Navigation.NavigationStack.Count == 1)
            {
                await App.RealmApp.CurrentUser.LogOutAsync();
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
            var item = (Image)sender;
            var taskToDelete = _tasks.FirstOrDefault(t => t.Id == item.AutomationId);
            var result = await DisplayAlert("Delete Task",
                $"Are you sure you want to delete \"{taskToDelete.Summary}\"?",
                "Yes", "No");

            if (result == false) return;

            taskRealm.Write(() =>
            {
                taskRealm.Remove(taskToDelete);
            });

            SetUpTaskList();
        }

        void chkCompleted_Toggled(object sender, ToggledEventArgs e)
        {
            var isCompleteSwitch = (Switch)sender;
            var changedTask = _tasks.FirstOrDefault(t => t.Id == isCompleteSwitch.AutomationId);
        }
    }
}
