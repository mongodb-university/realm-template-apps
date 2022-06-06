import SwiftUI
import RealmSwift

/// Instantiate a new Todo object, let the user input a ``summary``, and then
/// append it to the ``todos`` collection to add it to the Todo list.
struct CreateTodoView: View {
    // The ``todos`` ObservedResults collection is the
    // entire list of Todo items in the realm.
    @ObservedResults(Todo.self) var todos
    
    // Create a new Realm Todo object.
    @State private var newTodo = Todo()
    
    // We've passed in the ``creatingNewTodo`` variable
    // from the TodosView to know when the user is done
    // with the new Todo and we should return to the TodosView.
    @Binding var isInCreateTodoView: Bool
    
    // :state-start: flexible-sync
    @State var user: User
    
    // :state-end:
    @State var todoSummary = ""

    var body: some View {
        Form {
            Section(header: Text("Todo Name")) {
                // When using Atlas Device Sync, binding directly to the
                // synced property can cause performance issues. Instead,
                // we'll bind to a `@State` variable and then assign to the
                // synced property when the user presses `Save`
                TextField("New todo", text: $todoSummary)
            }
            Section {
                Button(action: {
                    // :state-start: flexible-sync
                    newTodo.owner_id = user.id
                    // :state-end:
                    // To avoid updating too many times and causing Sync-related
                    // performance issues, we only assign to the `newTodo.summary`
                    // once when the user presses `Save`.
                    newTodo.summary = todoSummary
                    // Appending the new Todo object to the ``todos``
                    // ObservedResults collection adds it to the
                    // realm in an implicit write.
                    $todos.append(newTodo)
                    
                    // Now we're done with this view, so set the
                    // ``isInCreateTodoView`` variable to false to
                    // return to the TodosView.
                    isInCreateTodoView = false
                }) {
                    HStack {
                        Spacer()
                        Text("Save")
                        Spacer()
                    }
                }
                Button(action: {
                    // If the user cancels, we don't want to
                    // append the new object we created to the
                    // task list, so we set the ``isInCreateTodoView``
                    // value to false to return to the TodosView.
                    isInCreateTodoView = false
                }) {
                    HStack {
                        Spacer()
                        Text("Cancel")
                        Spacer()
                    }
                }
            }
        }
        .navigationBarTitle("Add Todo")
    }
}
