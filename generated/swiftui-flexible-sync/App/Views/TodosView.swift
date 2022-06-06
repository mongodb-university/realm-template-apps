import SwiftUI
import RealmSwift

/// Use views to see a list of all Todos, add or delete todos, or logout.
struct TodosView: View {
    var leadingBarButton: AnyView?
    // ObservedResults is a mutable collection; here it's
    // all of the Todo objects in the realm.
    // You can append or delete todos directly from the collection.
    @ObservedResults(Todo.self) var todo
    @State var isInCreateTodoView = false
    @State var todoSummary = ""
    @State var user: User
    
    var body: some View {
        NavigationView {
            VStack {
                if isInCreateTodoView {
                    CreateTodoView(isInCreateTodoView: $isInCreateTodoView, user: user)
                }
                else {
                    TodoList()
                }
            }
            .navigationBarItems(leading: self.leadingBarButton,
                trailing: HStack {
                    Button {
                        isInCreateTodoView = true
                    } label: {
                        Image(systemName: "plus")
                    }
            })
        }
    }
}
