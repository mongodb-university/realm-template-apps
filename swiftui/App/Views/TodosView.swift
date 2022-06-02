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
    // :state-start: flexible-sync
    @State var user: User
    // :state-end:
    
    var body: some View {
        NavigationView {
            VStack {
                if isInCreateTodoView {
                    // :state-start: partition-based-sync
                    CreateTodoView(isInCreateTodoView: $isInCreateTodoView)
                    // :state-end:
                    // :state-start: flexible-sync
                    CreateTodoView(isInCreateTodoView: $isInCreateTodoView, user: user)
                    // :state-end:
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
