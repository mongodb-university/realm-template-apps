import SwiftUI
import RealmSwift

/// View a list of all todos in the realm. User can swipe to delete todos.
struct TodoList: View {
    // ObservedResults is a collection of all Todo objects in the realm.
    // Deleting objects from the observed collection
    // deletes them from the realm.
    @ObservedResults(Todo.self) var todos
    
    var body: some View {
        VStack {
            List {
                ForEach(todos) { todo in
                    TodoRow(todo: todo)
                }.onDelete(perform: $todos.remove)
            }
            .listStyle(InsetListStyle())
            Spacer()
            Text("Log in with the same account on another device or simulator to see your list sync in real-time")
                .frame(maxWidth: 300, alignment: .center)
        }
        .navigationBarTitle("Todos", displayMode: .inline)
    }
}
