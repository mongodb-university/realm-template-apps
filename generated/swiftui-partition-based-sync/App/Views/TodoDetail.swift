import SwiftUI
import RealmSwift

/// Show a detail view of a todo. User can edit or mark the todo complete.
struct TodoDetail: View {
    // This property wrapper observes the Todo object and
    // invalidates the view when the Todo object changes.
    @ObservedRealmObject var todo: Todo
    
    var body: some View {
        Form {
            Section(header: Text("Edit Todo Summary")) {
                // Accessing the observed todo object lets us update the live object
                // No need to explicitly update the object in a write transaction
                TextField("Summary", text: $todo.summary)
            }
            Section {
                Toggle(isOn: $todo.isComplete) {
                    Text("Complete")
                }
            }
        }
        .navigationBarTitle("Update Todo", displayMode: .inline)
    }
}
