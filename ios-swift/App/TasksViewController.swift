import UIKit
import RealmSwift

class TasksViewController: UITableViewController {
    @IBOutlet var logOutBarButtonItem: UIBarButtonItem!
    @IBOutlet var addTaskBarButtonItem: UIBarButtonItem!

    var realm: Realm!

    override func viewDidLoad() {
        logOutBarButtonItem.target = self
        logOutBarButtonItem.action = #selector(logOut)
        addTaskBarButtonItem.target = self
        addTaskBarButtonItem.action = #selector(addTask)
        
        realm = try! Realm()
    }

    @objc func logOut() {
        let alertController = UIAlertController(title: "Log Out", message: nil, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "Yes, Log Out", style: .destructive) { _ in
            print("Logging out...")
            realmApp.currentUser!.logOut { _ in
                DispatchQueue.main.async {
                    print("Logged out!")
                    self.navigationController!.popToRootViewController(animated: true)
                }
            }
        })
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        present(alertController, animated: true, completion: nil)
    }
    
    @objc func addTask() {
        let alertController = UIAlertController(title: "Add Task", message: nil, preferredStyle: .alert)

        // When the user clicks the add button, present them with a dialog to enter the task name.
        alertController.addAction(UIAlertAction(title: "Save", style: .default, handler: { _ in
            let textField = alertController.textFields![0] as UITextField

            // Create a new Task with the text that the user entered.
            let task = Task(summary: textField.text ?? "New Task")

            // Any writes to the Realm must occur in a write block.
            try! self.realm.write {
                // Add the Task to the Realm. That's it!
                self.realm.add(task)
            }
        }))
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alertController.addTextField(configurationHandler: { (textField: UITextField!) -> Void in
            textField.placeholder = "New Task Summary"
        })

        // Show the dialog.
        self.present(alertController, animated: true, completion: nil)
    }
}
