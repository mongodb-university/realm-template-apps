import UIKit

class EmailPasswordViewController: UIViewController {
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var submitButton: UIButton!
    @IBOutlet weak var modeChangeButton: UIButton!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!

    override func viewDidLoad() {
        modeChangeButton.addTarget(nil, action: #selector(WelcomeViewController.changeModeButtonPressed), for: .touchUpInside)
        submitButton.addTarget(nil, action: #selector(WelcomeViewController.submitButtonPressed), for: .touchUpInside)
    }
}
