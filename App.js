import React from "react";
import AppContext from "./context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Home } from "./screens/Home";
import { SignIn } from "./screens/SignIn";
import { New } from "./screens/New";
import { Stats } from "./screens/Stats";
import { Subscription } from "./screens/Subscription";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import getEnvVars from "./environment";
import { fetchSubscriptions, fetchLogin, fetchSignUp } from "./utils";

export default function App() {
  const { apiUrl } = getEnvVars();
  const Stack = createStackNavigator();
  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    subscriptions: [],
    errorMessage: ""
  };
  const [state, dispatch] = React.useReducer((prevState, action) => {
    switch (action.type) {
      case "RESTORE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          subscriptions: action.subscriptions,
        };
      case "SIGN_IN":
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
          subscriptions: action.subscriptions,
          errorMessage: ""
        };
      case "SIGN_OUT":
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
          subscriptions: [],
        };
      case "SUBSCRIPTIONS":
        return {
          ...prevState,
          subscriptions: action.subscriptions,
        };
      case "ERROR_MESSAGE":
        return {
          ...prevState,
          errorMessage: "Incorrect credentials ❌",
        };
    }
  }, initialState);

  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        let userToken = await AsyncStorage.getItem("userToken");
        if (!userToken) {
          throw new Error("no user token");
        } else {
          const subscriptions = await fetchSubscriptions(userToken);
          dispatch({
            type: "RESTORE_TOKEN",
            token: userToken,
            subscriptions: subscriptions,
          });
        }
      } catch (e) {
        dispatch({
          type: "RESTORE_TOKEN",
          token: null,
          subscriptions: [],
        });
      }
    };
    fetchToken();
  }, []);

  const appContext = {
    login: async ({ email, password }) => {
      try {
        const { jwt } = await fetchLogin(email, password);
        await AsyncStorage.setItem("userToken", jwt);
        const subscriptions = await fetchSubscriptions(jwt);
        dispatch({
          type: "SIGN_IN",
          token: jwt,
          subscriptions: subscriptions,
        });
      } catch (err) {
        dispatch({
          type: "ERROR_MESSAGE",
        });
      }
    },
    signOut: async () => {
      await AsyncStorage.removeItem("userToken");
      dispatch({ type: "SIGN_OUT" });
    },
    signUp: async ({ email, password }) => {
      await fetchSignUp(email, password);
      const { jwt } = await fetchLogin(email, password);
      await AsyncStorage.setItem("userToken", jwt);
      dispatch({
        type: "SIGN_IN",
        token: jwt,
        subscriptions: [],
      });
    },
    refreshSubscriptions: async () => {
      let jwt = await AsyncStorage.getItem("userToken");
      const subscriptions = await fetchSubscriptions(jwt, apiUrl);
      dispatch({ type: "SUBSCRIPTIONS", subscriptions: subscriptions });
    },
    subscriptions: state.subscriptions,
    errorMessage: state.errorMessage
  };

  if (state.isLoading) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <AppContext.Provider value={appContext}>
          <ApplicationProvider {...eva} theme={eva.light}>
            <Stack.Navigator headerMode={false}>
              {state.userToken === null ? (
                <Stack.Screen name="SignIn" component={SignIn} />
              ) : (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="New" component={New} />
                  <Stack.Screen name="Stats" component={Stats} />
                  <Stack.Screen name="Subscription" component={Subscription} />
                </>
              )}
            </Stack.Navigator>
          </ApplicationProvider>
        </AppContext.Provider>
      </NavigationContainer>
    );
  }
}
