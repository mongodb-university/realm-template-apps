import SwiftUI
import RealmSwift

/// Create a new task.
struct NewTodo: View {
    // Appending objects to the ObservedResults collection
    // adds them to the realm.
    @ObservedResults(Todo.self) var todos
    @State private var newTodo = Todo()
    @Binding var addTodo: Bool

    var body: some View {
        Form {
            Section(header: Text("Todo Name")) {
                TextField("New todo", text: $newTodo.summary)
            }
            Section {
                Button(action: {
                    $todos.append(newTodo)
                    addTodo = false
                }) {
                    HStack {
                        Spacer()
                        Text("Save")
                        Spacer()
                    }
                }
                Button(action: {
                    addTodo = false
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
