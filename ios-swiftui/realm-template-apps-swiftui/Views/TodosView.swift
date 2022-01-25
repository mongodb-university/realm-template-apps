import SwiftUI
import RealmSwift

/// Use views to see a list of all Todos, add or delete todos, or logout.
struct TodosView: View {
    var leadingBarButton: AnyView?
    // ObservedResults is a mutable collection; here it's
    // all of the Todo objects in the realm.
    // You can append or delete todos directly from the collection.
    @ObservedResults(Todo.self) var todo
    @State var addTodo = false
    @State var todoSummary = ""
    
    var body: some View {
        NavigationView {
            VStack {
                if addTodo {
                    NewTodo(addTodo: $addTodo)
                }
                else {
                    TodoList()
                }
            }
            .navigationBarItems(leading: self.leadingBarButton,
                trailing: HStack {
                    Button {
                        addTodo = true
                    } label: {
                        Image(systemName: "plus")
                    }
            })
        }
    }
}
