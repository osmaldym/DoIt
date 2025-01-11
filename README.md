<p align="center">
  <img width='30%' src="https://github.com/osmaldym/DoIt/blob/main/assets/logo.png?raw=true" />
</p>

# Getting Started

* ### First go to [DoIt Backend](https://github.com/osmaldym/DoIt-backend) and follow README instructions.

## 1. Download all dependencies.

```bash
yarn install
```

## 2. Set server direction

### Get local ipv4 direction of your pc

```bash
# Windows
ipconfig | findstr IPv4 # Copy last direction
# Linux
ip -4 addr
```

Open `/config/environments.ts` and paste the ip direction in PROD and DEV variables, if you change the port variable of .env in backend, set that port too.

## 3. Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# Using Yarn
yarn android
```

```bash
# Or using npm
npm run android
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

# And you're done!