import SwiftUI
import RealmSwift

/// Use views to see a list of all Todos, add or delete todos, or logout.
struct TodosView: View {
    var leadingBarButton: AnyView?
    // ObservedResults is a mutable collection; here it's
    // all of the Todo objects in the realm.
    // You can append or delete todos directly from the collection.
    @ObservedResults(Todo.self) var todo
    @State var creatingNewTodo = false
    @State var todoSummary = ""
    
    var body: some View {
        NavigationView {
            VStack {
                if creatingNewTodo {
                    CreateTodo(creatingNewTodo: $creatingNewTodo)
                }
                else {
                    TodoList()
                }
            }
            .navigationBarItems(leading: self.leadingBarButton,
                trailing: HStack {
                    Button {
                        creatingNewTodo = true
                    } label: {
                        Image(systemName: "plus")
                    }
            })
        }
    }
}