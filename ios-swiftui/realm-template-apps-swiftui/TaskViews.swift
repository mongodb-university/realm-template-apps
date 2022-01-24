import SwiftUI
import RealmSwift

/// Show a detail view of a task. User can edit or mark the task complete.
struct TaskDetail: View {
    // This property wrapper observes the Task object and
    // invalidates the view when the Task object changes.
    @ObservedRealmObject var task: Task
    
    var body: some View {
        Form {
            Section(header: Text("Edit Task Summary")) {
                // Accessing the observed task object lets us update the live object
                // No need to explicitly update the object in a write transaction
                TextField("Summary", text: $task.summary)
            }
            Section {
                Toggle(isOn: $task.isComplete) {
                    Text("Complete")
                }
            }
        }
        .navigationBarTitle("Update Task", displayMode: .inline)
    }
}

struct TaskRow: View {
    @ObservedRealmObject var task: Task
    
    var body: some View {
        NavigationLink(destination: TaskDetail(task: task)) {
            Text(task.summary)
            Spacer()
            if task.isComplete {
                Image(systemName: "checkmark")
                    .foregroundColor(.blue)
                    .padding(.trailing, 10)
            }
        }
    }
}

/// Use views to see a list of all Tasks, add or delete tasks, or logout.
struct TasksView: View {
    // ObservedResults is a mutable collection; here it's
    // all of the Task objects in the realm.
    // You can append or delete tasks directly from the collection.
    @ObservedResults(Task.self) var tasks
    @State var addTask = false
    @State var isLoggingOut = false
    @State var taskSummary = ""
    
    var body: some View {
        NavigationView {
            VStack {
                if addTask {
                    NewTask(addTask: $addTask)
                }
                else if isLoggingOut {
                    LogoutView(isLoggedOut: false, isLoggingOut: $isLoggingOut)
                }
                else {
                    TaskList()
                }
            }
            .navigationBarItems(leading: HStack {
                Button("Logout") {
                    isLoggingOut = true
                }
            },
                                trailing: HStack {
                Button {
                    addTask = true
                } label: {
                    Image(systemName: "plus")
                }
            })
        }
    }
}

/// View a list of all tasks in the realm. User can swipe to delete tasks.
struct TaskList: View {
    // ObservedResults is a collection of all Task objects in the realm.
    // Deleting objects from the observed collection
    // deletes them from the realm.
    @ObservedResults(Task.self) var tasks
    var body: some View {
        VStack {
            List {
                ForEach(tasks) { task in
                    TaskRow(task: task)
                }.onDelete(perform: $tasks.remove)
            }
            .listStyle(InsetListStyle())
            Spacer()
            Text("Log in with the same account on another device or simulator to see your list sync in real-time")
                .frame(maxWidth: 300, alignment: .center)
        }
        .navigationBarTitle("Tasks", displayMode: .inline)
    }
}

/// Create a new task.
struct NewTask: View {
    // Appending objects to the ObservedResults collection
    // adds them to the realm.
    @ObservedResults(Task.self) var tasks
    @State private var newTask = Task()
    @Binding var addTask: Bool

    var body: some View {
        Form {
            Section(header: Text("Task Name")) {
                TextField("New task", text: $newTask.summary)
            }
            Section {
                Button(action: {
                    $tasks.append(newTask)
                    addTask = false
                }) {
                    HStack {
                        Spacer()
                        Text("Save")
                        Spacer()
                    }
                }
                Button(action: {
                    addTask = false
                }) {
                    HStack {
                        Spacer()
                        Text("Cancel")
                        Spacer()
                    }
                }
            }
        }
        .navigationBarTitle("Add Task")
    }
}
