import SwiftUI

struct ErrorView: View {
    @State var error: Error
        
    var body: some View {
        VStack {
            Text("Error: \(error.localizedDescription)")
        }
    }
}
