import SwiftUI
import RealmSwift

struct TodoRow: View {
    @ObservedRealmObject var todo: Todo
    
    var body: some View {
        NavigationLink(destination: TodoDetail(todo: todo)) {
            Text(todo.summary)
            Spacer()
            if todo.isComplete {
                Image(systemName: "checkmark")
                    .foregroundColor(.blue)
                    .padding(.trailing, 10)
            }
        }
    }
}
