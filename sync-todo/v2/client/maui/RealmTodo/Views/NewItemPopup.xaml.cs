using System.ComponentModel;
using CommunityToolkit.Maui.Views;
using CommunityToolkit.Mvvm.ComponentModel;
using RealmTodo.Models;
using RealmTodo.ViewModels;

namespace RealmTodo.Views;

public partial class NewItemPopup : Popup
{
    public NewItemPopup(ItemsViewModel itemsViewModel)
    {
        InitializeComponent();
        BindingContext = itemsViewModel;
    }

    void HandleOKButtonClicked(object sender, EventArgs e) => Close(true);

    void HandleCancelButtonClicked(object sender, EventArgs e) => Close(false);
}
