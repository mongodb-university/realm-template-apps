package com.mongodb.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.mongodb.app.ui.login.LoginScaffold
import com.mongodb.app.ui.theme.MyApplicationTheme

class ComposeLoginActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (realmApp.currentUser != null) {
            startActivity(Intent(this, ComposeItemActivity::class.java))
            finish()
            return
        }

        setContent {
            MyApplicationTheme {
                LoginScaffold()
            }
        }
    }
}

const val USABLE_WIDTH = 0.8F

@Preview(showBackground = true)
@Composable
fun LoginActivityPreview() {
    MyApplicationTheme {
        LoginScaffold()
    }
}
