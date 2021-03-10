import UIKit

class TasksViewController: UITableViewController {
    override func viewDidLoad() {
        // On the top left is a log out button.
        navigationController?.navigationBar.isHidden = false
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Log Out", style: .plain, target: self, action: #selector(logOutButtonDidClick))
    }

    @objc func logOutButtonDidClick() {
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
}
