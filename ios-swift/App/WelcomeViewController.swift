import UIKit

class WelcomeViewController: UIPageViewController, UIPageViewControllerDataSource, UIPageViewControllerDelegate {
    var signUp: EmailPasswordViewController?
    var signIn: EmailPasswordViewController?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.delegate = self
        self.dataSource = self
        signUp = (storyboard!.instantiateViewController(withIdentifier: "signUp") as! EmailPasswordViewController)
        signIn = (storyboard!.instantiateViewController(withIdentifier: "signIn") as! EmailPasswordViewController)
        setViewControllers([signUp!], direction: UIPageViewController.NavigationDirection.forward, animated: false)
    }

    func pageViewController(_ pageViewController: UIPageViewController, viewControllerBefore viewController: UIViewController) -> UIViewController? {
        return viewController == signIn ? signUp : nil
    }
    
    func pageViewController(_ pageViewController: UIPageViewController, viewControllerAfter viewController: UIViewController) -> UIViewController? {
        return viewController == signUp ? signIn : nil
    }
    
    @IBAction func changeModeButtonPressed() {
        guard let current = self.viewControllers?.first else {
            return
        }
        self.view.isUserInteractionEnabled = false
        let next = current == signIn ? signUp : signIn
        let direction: UIPageViewController.NavigationDirection = current == signUp ? .forward : .reverse
        setViewControllers([next!], direction: direction, animated: true) { _ in
            self.view.isUserInteractionEnabled = true
        }
    }

    @IBAction func submitButtonPressed(sender: UIButton) {
        let isSignUp = sender == self.signUp?.submitButton
        let current = isSignUp ? self.signUp! : self.signIn!
        let email = current.emailField.text!
        let password = current.passwordField.text!
        print("\(isSignUp ? "Sign up" : "Sign in") with \(email) and \(password)")
        current.activityIndicator.startAnimating()
        // TODO: Actually log in
        current.activityIndicator.stopAnimating()
        performSegue(withIdentifier: "onAuthenticationComplete", sender: self)
    }
}
