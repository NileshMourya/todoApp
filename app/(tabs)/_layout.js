import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { StatusBar, Text } from "react-native";
import RootNavigator from "@/app/src/navigation";
import store from "@/app/src/store";
import { COLORS } from "@/app/src/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { SplashScreen } from "expo-router";

export default function TabLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFontsAndHideSplash() {
      try {
        // Load fonts here
        await Font.loadAsync({
          "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
        });
      } catch (error) {
        console.warn(error);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    loadFontsAndHideSplash();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
        <RootNavigator />
      </SafeAreaView>
    </Provider>
  );
}
