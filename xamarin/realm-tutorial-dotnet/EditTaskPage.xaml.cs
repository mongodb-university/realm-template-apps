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
        private bool newStatus;

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

        void Status_Entry_Completed(object sender, EventArgs e)
        {
            newStatus = ((CheckBox)sender).IsChecked;
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
                TaskToEdit.IsComplete = newStatus;
            });
            OperationCompeleted(this, EventArgs.Empty);
            await Navigation.PopAsync();

            realm.Dispose();
            return;
        }
    }
}