# Generate Android APK from PWA using Bubblewrap

## Prerequisites
```bash
npm install -g @bubblewrap/cli
```

## Steps

### 1. Initialize Bubblewrap
```bash
bubblewrap init --manifest https://your-domain.com/manifest.json
```

### 2. Configure (answer prompts)
- App name: ACK Parish
- Package name: com.ackparish.app
- Host: your-domain.com
- Start URL: /
- Theme color: #1a3a5c
- Background color: #1a3a5c

### 3. Build APK
```bash
bubblewrap build
```

### 4. Output
APK will be in: `./app-release-signed.apk`

## Alternative: Manual TWA Setup

### 1. Install Android Studio
Download from: https://developer.android.com/studio

### 2. Create New Project
- Select "Empty Activity"
- Package name: com.ackparish.app
- Language: Kotlin

### 3. Add TWA Dependencies
In `app/build.gradle`:
```gradle
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
```

### 4. Configure AndroidManifest.xml
```xml
<activity
    android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
    android:label="@string/app_name"
    android:exported="true">
    <meta-data
        android:name="android.support.customtabs.trusted.DEFAULT_URL"
        android:value="https://your-domain.com" />
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

### 5. Add Digital Asset Links
In `app/src/main/res/values/strings.xml`:
```xml
<string name="asset_statements">
    [{
        \"relation\": [\"delegate_permission/common.handle_all_urls\"],
        \"target\": {
            \"namespace\": \"web\",
            \"site\": \"https://your-domain.com\"
        }
    }]
</string>
```

### 6. Build APK
```bash
./gradlew assembleRelease
```

## Option 2: Capacitor (More Native Features)

### 1. Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
```

### 2. Build Web App
```bash
npm run build
```

### 3. Add Android Platform
```bash
npx cap add android
npx cap sync
```

### 4. Open in Android Studio
```bash
npx cap open android
```

### 5. Build APK
In Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)

## Deploy to Play Store

### 1. Create Play Console Account
- Go to: https://play.google.com/console
- Pay $25 one-time fee

### 2. Create App
- App name: ACK Parish
- Category: Lifestyle
- Content rating: Everyone

### 3. Upload APK/AAB
- Go to Production > Create new release
- Upload your APK or AAB file

### 4. Complete Store Listing
- Screenshots (phone & tablet)
- Feature graphic (1024x500)
- App icon (512x512)
- Description
- Privacy policy URL

### 5. Submit for Review
Usually takes 1-3 days for approval.

## Important Notes
- Your PWA must be deployed and accessible via HTTPS
- Add `.well-known/assetlinks.json` to your domain for TWA verification
- Test APK on real device before submitting
