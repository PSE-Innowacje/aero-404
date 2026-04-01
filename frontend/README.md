# Deploy

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.5.

## Web

To build Andorid ap

```bash
ng b
```
file ready  for production will be in
[/dist/frontend/browser](./dist/frontend/browser) 

## Andorid

To build Andorid app

```bash
ng b
npx cap sync
npx cap open android
```

On opening Android Studio 
`Build` > `Generate Signed App Bundle or APK`
ready file will be in
[/android/app/release](./android/app/release) 