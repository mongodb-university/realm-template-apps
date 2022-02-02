import SwiftUI
import RealmSwift

/// Instantiate a new Todo object, let the user input a ``summary``, and then
/// append it to the ``todos`` collection to add it to the Todo list.
struct CreateTodo: View {
    // The ``todos`` ObservedResults collection is the
    // entire list of Todo items in the realm.
    @ObservedResults(Todo.self) var todos
    
    // Create a new Realm Todo object.
    @State private var newTodo = Todo()
    
    // We've passed in the ``creatingNewTodo`` variable
    // from the TodosView to know when the user is done
    // with the new Todo and we should return to the TodosView.
    @Binding var creatingNewTodo: Bool

    var body: some View {
        Form {
            Section(header: Text("Todo Name")) {
                // The object is created when we enter the view.
                // That means you can access the ``summary``
                // property directly to let the user input a summary.
                TextField("New todo", text: $newTodo.summary)
            }
            Section {
                Button(action: {
                    // Appending the new Todo object to the ``todos``
                    // ObservedResults collection adds it to the
                    // realm in an implicit write.
                    $todos.append(newTodo)
                    
                    // Now we're done with this view, so set the
                    // ``creatingNewTodo`` variable to false to
                    // return to the TodosView.
                    creatingNewTodo = false
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
                    // task list, so we set the ``creatingNewTodo``
                    // value to false to return to the TodosView.
                    creatingNewTodo = false
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
