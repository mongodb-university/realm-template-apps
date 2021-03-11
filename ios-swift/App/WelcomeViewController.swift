import UIKit
import RealmSwift

class WelcomeViewController: UIViewController {
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var submitButton: UIButton!
    @IBOutlet weak var changeModeButton: UIButton!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!

    private var isInSignUpMode = true

    override func viewDidLoad() {
        super.viewDidLoad()
        changeModeButton.addTarget(self, action: #selector(modeChangeButtonPressed), for: .touchUpInside)
        submitButton.addTarget(self, action: #selector(submitButtonPressed), for: .touchUpInside)
        // If a user is already looged in, go directly to the items screen
        if let user = realmApp.currentUser {
            setDefaultConfiguration(forUser: user)
            performSegue(withIdentifier: "onAuthenticationComplete", sender: self)
        }
    }

    override func viewWillAppear(_ animated: Bool) {
        navigationController?.navigationBar.isHidden = true
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        navigationController?.navigationBar.isHidden = false
    }

    /// Switches the UI between sign in (log in) and sign up (create account) mode.
    @IBAction func modeChangeButtonPressed() {
        isInSignUpMode = !isInSignUpMode
        if (isInSignUpMode) {
            submitButton.setTitle("Create Account", for: .normal)
            changeModeButton.setTitle("Already have an account? Log In", for: .normal)
        } else {
            submitButton.setTitle("Log In", for: .normal)
            changeModeButton.setTitle("Don't have an account? Create Account", for: .normal)
        }
    }
    
    /// Action called when the submit button is pressed to either create an account or log in.
    @IBAction func submitButtonPressed() {
        let email = emailField.text!
        let password = passwordField.text!
        if (isInSignUpMode) {
            signUp(email: email, password: password)
        } else {
            signIn(email: email, password: password)
        }
    }
    
    /// Registers a new user with the email/password authentication provider.
    func signUp(email: String, password: String) {
        setLoading(true)
        realmApp.emailPasswordAuth.registerUser(email: email, password: password) { error in
            DispatchQueue.main.async {
                self.setLoading(false)
                guard error == nil else {
                    print("Account creation failed: \(error!)")
                    self.reportError(error!)
                    return
                }
                self.signIn(email: email, password: password)
            }
        }
    }
    
    /// Logs in with an existing user.
    func signIn(email: String, password: String) {
        setLoading(true)
        realmApp.login(credentials: Credentials.emailPassword(email: email, password: password)) { result in
            DispatchQueue.main.async {
                self.setLoading(false)
                switch result {
                case let .failure(error):
                    print("Failed to log in: \(error)")
                    self.reportError(error)
                case let .success(user):
                    self.onSignInComplete(user)
                }
            }
        }
    }
    
    /// Called when sign in completes. Opens the realm asynchronously and navigates to the Tasks screen.
    func onSignInComplete(_ user: User) {
        setDefaultConfiguration(forUser: user)

        setLoading(true)
        Realm.asyncOpen { result in
            DispatchQueue.main.async {
                self.setLoading(false)
                switch result {
                case  let .failure(error):
                    print("Failed to open realm: \(error)")
                    self.reportError(error)
                case .success:
                    // Realm fully loaded
                    self.performSegue(withIdentifier: "onAuthenticationComplete", sender: self)
                }
            }
        }
    }

    /// Turns on or off the activity indicator.
    func setLoading(_ loading: Bool) {
        if loading {
            activityIndicator.startAnimating()
        } else {
            activityIndicator.stopAnimating()
        }
        emailField.isEnabled = !loading
        passwordField.isEnabled = !loading
        submitButton.isEnabled = !loading
        changeModeButton.isEnabled = !loading
    }
    
    /// Sets the configuration to use when opening a realm for the given user.
    func setDefaultConfiguration(forUser user: User) {
        Realm.Configuration.defaultConfiguration = user.configuration(partitionValue: user.id)
    }
}

extension UIViewController {
    /// Presents the user with an error alert.
    func reportError(_ error: Error) {
        let alertController = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "Ok", style: .default, handler: { _ in
            alertController.dismiss(animated: true)
        }))
        present(alertController, animated: true)
    }
}
