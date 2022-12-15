plugins {
    id("com.android.application")
    kotlin("android")
    id("io.realm.kotlin")
}

android {
    compileSdk = 31
    defaultConfig {
        applicationId = "com.mongodb.app"
        minSdk = 28
        targetSdk = 31
        versionCode = 1
        versionName = "1.0"
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("com.google.android.material:material:1.4.0")
    implementation("androidx.appcompat:appcompat:1.3.1")
    implementation("androidx.constraintlayout:constraintlayout:2.1.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.0-native-mt")
    implementation("io.realm.kotlin:library-sync:1.0.0") // DON'T FORGET TO UPDATE VERSION IN PROJECT GRADLE
}