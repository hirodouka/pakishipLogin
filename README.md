# PakiAPPS (Customer Mobile App)

Welcome to the React Native (Expo) mobile application for PakiAPPS.
The project is built using Expo SDK 54 and includes a high-fidelity booking flow.

## 🚀 First-Time Setup & Running

Follow these exact steps to ensure the app starts correctly, especially if you encounter styling or dependency errors.

### 1. Install Dependencies
Because your system might block PowerShell scripts, prefix `npm` and `npx` commands with `cmd /c`:
```bash
cmd /c "npm install --legacy-peer-deps"
```
*(We use `--legacy-peer-deps` to handle specific version requirements for Expo SDK 54)*

### 2. Run the App (Localtunnel Mode)
If the standard `npx expo start --tunnel` fails with "remote gone away" (a common ngrok compatibility error), use the fixed localtunnel command:
```bash
npm run start:lt
```
> [!NOTE]
> If you are running the app for the first time or recently changed your `.env`, use the clear-cache command: `npx expo start -c`.

### 3. Scan the QR Code
Once the QR code appears in your terminal:
- **iOS**: Scan with your **Camera app**.
- **Android**: Open the **Expo Go** app and use the built-in scanner.

---

## 🛠️ Troubleshooting

### "Remote Gone Away" Error
This happens because your ngrok version is incompatible with the latest SDK.
**The Fix**: Use `npm run start:lt`. This bypasses ngrok entirely and uses a custom tunnel URL defined in your `.env`.

### "Use process(css).then(cb)" Error
If you see a red screen with this error, it means the Babel cache is stale. 
1. Stop the server (`Ctrl + C`).
2. Restart with: `npx expo start -c`.

### Missing Configuration (Babel/Tailwind)
If styles or path aliases (e.g., `@/features/...`) aren't working, ensure `babel.config.js` and `tailwind.config.js` exist in the root directory.

---

## Tech Stack 🛠️
- **Framework:** React Native (`expo` SDK 54)
- **Navigation:** React Navigation (RootNavigator)
- **Styling:** NativeWind (TailwindCSS for React Native)
- **Tunneling:** `localtunnel` (Workaround for ngrok v2 incompatibility)
- **Icons:** `lucide-react-native`
- **Figma Design:** [Original Concepts](https://www.figma.com/design/E4Y9z4rrXBx9JwQDgUONIt/PakiAPPS--Copy-)