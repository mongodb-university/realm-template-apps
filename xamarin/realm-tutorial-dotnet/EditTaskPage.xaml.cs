using System;
using RealmTemplateApp.Models;
using Realms;
using Xamarin.Forms;

namespace RealmTemplateApp
{
    public partial class EditTaskPage : ContentPage
    {
        public Task TaskToEdit;
        private Realm realm;
        private string newName;

        public EditTaskPage(Realm realm, Task task)
        {
            InitializeComponent();
            this.realm = realm;
            this.TaskToEdit = task;
            txtName.Text = task.Summary;
        }

        public event EventHandler<EventArgs> OperationCompeleted = delegate { };

        void Name_Entry_Completed(object sender, EventArgs e)
        {
            newName = ((Entry)sender).Text;
        }

        async void Cancel_Button_Clicked(object sender, EventArgs e)
        {
            OperationCompeleted(this, EventArgs.Empty);
            await Navigation.PopAsync();
            return;
        }

        async void Save_Button_Clicked(object sender, EventArgs e)
        {
            realm.Write(() =>
            {
                TaskToEdit.Summary = newName;
                TaskToEdit.IsComplete = TaskToEdit.IsComplete; // no change here
            });
            OperationCompeleted(this, EventArgs.Empty);
            await Navigation.PopAsync();

            realm.Dispose();
            return;
        }
    }
}