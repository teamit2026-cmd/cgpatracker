# Release Checklist - CGPA Tracker

Follow these steps to ensure a smooth transition from development to production.

## 1. Code Quality & Cleanup
- [x] Uninstall unused packages (`expo-document-picker`, `expo-sharing`, etc.)
- [x] Update `.gitignore` to exclude local Realm files (`*.realm`)
- [x] Run `npx expo start -c` to ensure a clean Metro bundle
- [ ] Remove all `console.log` statements from production code
- [ ] Ensure all API URLs (if any) are set to production environment

## 2. Branding & Assets
- [x] Verify app icon (`assets/logo.png`) is correctly set in `app.json`
- [x] Check Splash Screen visibility and consistency
- [ ] Update version number in `app.json` and `package.json`
- [ ] Ensure all developer profiles in `about.js` are up to date

## 3. Testing
- [x] Verify CGPA calculation accuracy across all departments
- [x] Test "Custom Subjects" flow for edge cases (0 credits, empty names)
- [x] Validate PDF Export functionality in `Download.js`
- [x] Check responsive layout on different screen sizes (Phone/Tablet)
- [x] Verify persistent storage with Realm after app reload

## 4. Documentation
- [x] Create professional `README.md`
- [x] Define `requirements.txt` for environment setup
- [x] include `LICENSE` and `CONTRIBUTING.md`
- [x] Update project metadata in `app.json`

## 5. Build & Deployment
- [ ] Run `eas build -p android` (Requires Expo Application Services)
- [ ] Generate Android App Bundle (.aab) for Play Store
- [ ] Update Privacy Policy URL in the store listing

---
*Maintained by Team Hexonyx*
