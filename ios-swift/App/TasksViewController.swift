import UIKit
import RealmSwift

class TasksViewController: UITableViewController {
    @IBOutlet var logOutBarButtonItem: UIBarButtonItem!
    @IBOutlet var addTaskBarButtonItem: UIBarButtonItem!

    lazy var realm = try! Realm()
    lazy var tasks = realm.objects(Task.self).sorted(byKeyPath: "_id")
    var notificationToken: NotificationToken?

    override func viewDidLoad() {
        logOutBarButtonItem.target = self
        logOutBarButtonItem.action = #selector(logOut)
        addTaskBarButtonItem.target = self
        addTaskBarButtonItem.action = #selector(addTask)
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

    override func viewWillAppear(_ animated: Bool) {
        notificationToken = tasks.observe { (changes) in
            let tableView = self.tableView!
            switch changes {
            case .initial:
                // Results are now populated and can be accessed without blocking the UI
                tableView.reloadData()
            case let .update(_, deletions, insertions, modifications):
                // Query results have changed, so apply them to the UITableView.
                tableView.performBatchUpdates({
                    // It's important to be sure to always update a table in this order:
                    // deletions, insertions, then updates. Otherwise, you could be unintentionally
                    // updating at the wrong index.
                    tableView.deleteRows(at: deletions.map({ IndexPath(row: $0, section: 0) }),
                        with: .automatic)
                    tableView.insertRows(at: insertions.map({ IndexPath(row: $0, section: 0) }),
                        with: .automatic)
                    tableView.reloadRows(at: modifications.map({ IndexPath(row: $0, section: 0) }),
                        with: .automatic)
                })
            case let .error(error):
                self.reportError(error)
            }
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        notificationToken?.invalidate()
    }

    
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return tasks.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        // This defines how the Tasks in the list look.
        // We want the task name on the left and some indication of its status on the right.
        let task = tasks[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell") ?? UITableViewCell(style: .default, reuseIdentifier: "Cell")
        cell.selectionStyle = .none
        cell.textLabel?.text = task.summary
        cell.accessoryType = task.isComplete ? UITableViewCell.AccessoryType.checkmark : UITableViewCell.AccessoryType.none
        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // User selected a task in the table.
        let task = tasks[indexPath.row]
        try! realm.write {
            // Update the task's status.
            task.isComplete = !task.isComplete
        }
    }
}
