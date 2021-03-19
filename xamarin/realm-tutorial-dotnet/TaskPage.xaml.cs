using System;
using System.Collections.ObjectModel;
using System.Linq;
using RealmTemplateApp.Models;
using Realms;
using Realms.Sync;
using Xamarin.Forms;

namespace RealmTemplateApp
{
    public partial class TaskPage : ContentPage
    {
        private Realm taskRealm;
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
            WaitingLayout.IsVisible = true;
            try
            {
                var syncConfig = new SyncConfiguration(
                    $"project={App.RealmApp.CurrentUser.Id }",
                    App.RealmApp.CurrentUser);
                taskRealm = await Realm.GetInstanceAsync(syncConfig);
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
            WaitingLayout.IsVisible = true;
            _tasks = new ObservableCollection<Task>(taskRealm.All<Task>().ToList());
            listTasks.ItemsSource = MyTasks;
            WaitingLayout.IsVisible = false;
        }

        async void TextCell_Tapped(object sender, ItemTappedEventArgs e)
        {
            var task = e.Item as Task;
            var editTaskPage = new EditTaskPage(taskRealm, task);
            editTaskPage.OperationCompeleted += EditTaskPage_OperationCompeleted;
            await Navigation.PushAsync(editTaskPage);
        }

        private void EditTaskPage_OperationCompeleted(object sender, EventArgs e)
        {
            (sender as EditTaskPage).OperationCompeleted -= EditTaskPage_OperationCompeleted;
            SetUpTaskList();
        }

        async void Button_Clicked(object sender, EventArgs e)
        {
            string result = await DisplayPromptAsync("New Task", "Enter the Task Name");

            if (result == null)
            {
                return;
            }

            if (taskRealm == null)
            {
                var syncConfig = new SyncConfiguration($"project={App.RealmApp.CurrentUser.Id }", App.RealmApp.CurrentUser);
                taskRealm = await Realm.GetInstanceAsync(syncConfig);
            }

            var newTask = new Task()
            {
                Name = result,
                Status = Task.TaskStatus.Open.ToString()
            };

            taskRealm.Write(() =>
            {
                taskRealm.Add(newTask);
            });

            MyTasks.Add(newTask);
        }
    }
}
