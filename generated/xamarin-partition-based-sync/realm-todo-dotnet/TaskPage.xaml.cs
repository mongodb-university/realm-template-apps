using System;
using System.Linq;
using RealmTemplateApp.Models;
using Realms;
using Xamarin.Forms;
using System.ComponentModel;
using Realms.Sync;
using System.Collections.Generic;
using Realms.Sync.Exceptions;

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
            var config = new FlexibleSyncConfiguration(user);
            taskRealm = Realm.GetInstance(config);

            var subscriptions = taskRealm.Subscriptions;
            subscriptions.Update(() =>
            {
                var defaultSubscription = taskRealm.All<Task>()
                    .Where(t => t.OwnerId == user.Id);
                subscriptions.Add(defaultSubscription);
            });

            Session.Error += SessionErrorHandler();
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
                WaitingLayout.IsVisible = false;
            }

            listTasks.ItemsSource = _tasks;
        }

        private async void New_Button_Clicked(object sender, EventArgs e)
        {
            string result = await DisplayPromptAsync("New Task", "Enter the Task Name");

            if (result == null)
            {
                return;
            }

            var newTask = new Task()
            {
                OwnerId = user.Id.ToString(),
                Summary = result,
                IsComplete = false
            };

            taskRealm.Write(() =>
            {
                taskRealm.Add(newTask);
            });
        }

        private void chkCompleted_PropertyChanged(object sender, PropertyChangedEventArgs e)
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

        private async void Logout_Clicked(object sender, EventArgs e)
        {
            // Ensure the realm is closed when the user logs out
            taskRealm.Dispose();
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
            var taskToDelete = (e as TappedEventArgs).Parameter as Task;
            var result = await DisplayAlert("Delete Task",
                $"Are you sure you want to delete \"{taskToDelete.Summary}\"?",
                "Yes", "No");

            if (result == false)
            {
                return;
            };

            taskRealm.Write(() =>
            {
                taskRealm.Remove(taskToDelete);
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
