import UIKit
import RealmSwift

class WelcomeViewController: UIViewController {
    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    @IBOutlet weak var submitButton: UIButton!
    @IBOutlet weak var modeChangeButton: UIButton!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!

    private var isInSignUpMode = true

    override func viewDidLoad() {
        super.viewDidLoad()
        modeChangeButton.addTarget(self, action: #selector(modeChangeButtonPressed), for: .touchUpInside)
        submitButton.addTarget(self, action: #selector(submitButtonPressed), for: .touchUpInside)
        // If a user is already looged in, go directly to the items screen
        if realmApp.currentUser != nil {
            self.performSegue(withIdentifier: "onAuthenticationComplete", sender: self)
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        navigationController?.navigationBar.isHidden = true
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        navigationController?.navigationBar.isHidden = false
    }

    @IBAction func modeChangeButtonPressed() {
        isInSignUpMode = !isInSignUpMode
        if (isInSignUpMode) {
            submitButton.setTitle("Create Account", for: .normal)
            modeChangeButton.setTitle("Already have an account? Log In", for: .normal)
        } else {
            submitButton.setTitle("Log In", for: .normal)
            modeChangeButton.setTitle("Don't have an account? Create Account", for: .normal)
        }
    }
    
    @IBAction func submitButtonPressed() {
        let email = emailField.text!
        let password = passwordField.text!
        if (isInSignUpMode) {
            signUp(email: email, password: password)
        } else {
            signIn(email: email, password: password)
        }
    }
    
    func signUp(email: String, password: String) {
        realmApp.emailPasswordAuth.registerUser(email: email, password: password) { error in
            DispatchQueue.main.async {
                guard error == nil else {
                    print("Signup failed: \(error!)")
                    return
                }
                self.signIn(email: email, password: password)
            }
        }
    }
    
    func signIn(email: String, password: String) {
        activityIndicator.startAnimating()
        realmApp.login(credentials: Credentials.emailPassword(email: email, password: password)) { result in
            DispatchQueue.main.async {
                self.activityIndicator.stopAnimating()
                switch result {
                case let .failure(error):
                    // TODO: this is not a fatal error
                    fatalError("Login failed: \(error.localizedDescription)")
                case let .success(user):
                    self.onSignInComplete(user)
                }
            }
        }
    }
    
    func onSignInComplete(_ user: User) {
        Realm.Configuration.defaultConfiguration = user.configuration(partitionValue: user.id)

        activityIndicator.startAnimating()
        Realm.asyncOpen { result in
            DispatchQueue.main.async {
                self.activityIndicator.stopAnimating()
                switch result {
                case  let .failure(error):
                    // TODO: this is not a fatal error
                    fatalError("Login failed: \(error.localizedDescription)")
                case  .success:
                    // Realm fully loaded
                    self.performSegue(withIdentifier: "onAuthenticationComplete", sender: self)
                }
            }
        }
    }
}
