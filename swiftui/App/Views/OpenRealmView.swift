import SwiftUI
import RealmSwift

// :state-uncomment-start: flexible-sync
// enum SubscriptionState {
//     case initial
//     case completed
// }
// :state-uncomment-end:

/// Called when login completes. Opens the realm asynchronously and navigates to the Todos screen.
struct OpenRealmView: View {
    // :state-uncomment-start: flexible-sync
    // let user = realmApp.currentUser
    // @State var subscriptionState: SubscriptionState = .initial
    // :state-uncomment-end:
    // :state-start: partition-based-sync
    // By leaving the `partitionValue` an empty string, we use the
    // `.environment(\.partitionValue, user.id)` passed in from the `ContentView`
    @AsyncOpen(appId: theAppConfig.appId, partitionValue: "", timeout: 4000) var asyncOpen
    // :state-end:
    // :state-uncomment-start: flexible-sync
    // @AsyncOpen(appId: testAppId, timeout: 2000) var asyncOpen
    // :state-uncomment-end:
       
    var body: some View {
       switch asyncOpen {
       // Starting the Realm.asyncOpen process.
       // Show a progress view.
       case .connecting:
           ProgressView()
       // Waiting for a user to be logged in before executing
       // Realm.asyncOpen.
       case .waitingForUser:
           ProgressView("Waiting for user to log in...")
       // The realm has been opened and is ready for use.
       // Show the Todos view.
       case .open(let realm):
           // :state-start: partition-based-sync
           TodosView(leadingBarButton: AnyView(LogoutButton()))
               .environment(\.realm, realm)
           // :state-end:
           // :state-uncomment-start: flexible-sync
           // switch subscriptionState {
           // case .initial:
           //     ProgressView("Subscribing to Query")
           //         .onAppear {
           //             Task {
           //                 do {
           //                     let subs = realm.subscriptions
           //                     if subs.count == 0 {
           //                         try await subs.write {
           //                             subs.append(QuerySubscription<Todo>(name: "user_tasks") {
           //                                 $0.owner_id == user!.id
           //                             })
           //                         }
           //
           //                     }
           //                     subscriptionState = .completed
           //                 }
           //             }
           //         }
           // case .completed:
           //     TodosView(leadingBarButton: AnyView(LogoutButton()))
           //          .environment(\.realm, realm)
           // }
           // :state-end:
       // The realm is currently being downloaded from the server.
       // Show a progress view.
       case .progress(let progress):
           ProgressView(progress)
       // Opening the Realm failed.
       // Show an error view.
       case .error(let error):
           ErrorView(error: error)
       }
    }
}
