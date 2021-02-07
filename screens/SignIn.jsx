import React, { useContext, useState } from "react";
import { Text, View } from "react-native";
import { Button, Input } from "@ui-kitten/components";
import AppContext from "../context/AppContext";

export function SignIn() {
  const { login, signUp, errorMessage } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [route, setRoute] = useState(0);
  // 0 for sign in, 1 for sign up
  return (
    <>
      <View style={{ height: 60, backgroundColor: "#2a9d8f" }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#2a9d8f",
        }}
      >
        <Text
          style={{
            fontSize: 23,
            fontWeight: "700",
            marginLeft: 15,
            marginBottom: 10,
            color: "white",
          }}
        >
          {route === 0 ? "Sign In" : "Sign Up"}
        </Text>
      </View>
      <View style={{ margin: 15, justifyContent: "center" }}>
        <Input
          value={email}
          label={(evaProps) => (
            <Text
              style={{
                color: "gray",
                fontWeight: "800",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              Email
            </Text>
          )}
          onChangeText={(nextValue) => setEmail(nextValue)}
        />
        <Input
          value={password}
          secureTextEntry
          label={(evaProps) => (
            <Text
              style={{
                color: "gray",
                fontWeight: "800",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              Password
            </Text>
          )}
          onChangeText={(nextValue) => setPassword(nextValue)}
        />
        <Button
          style={{ marginTop: 10 }}
          onPress={() => {
            if (route === 0) {
              login({ email, password });
            } else {
              signUp({ email, password });
            }
          }}
          appearance="outline"
        >
          Submit
        </Button>
        {route === 0 ? (
          <>
            <Text
              style={{
                marginTop: 30,
                fontSize: 18,
              }}
            >
              Don't have an account?{" "}
              <Text
                style={{
                  color: "blue",
                }}
                onPress={() => setRoute(1)}
              >
                Sign Up
              </Text>
            </Text>
            <Text
              style={{
                marginTop: 30,
                fontSize: 18,
              }}
            >
              {errorMessage}
            </Text>
          </>
        ) : (
          <Text
            style={{
              marginTop: 30,
              fontSize: 18,
              color: "blue",
            }}
            onPress={() => setRoute(0)}
          >
            Back
          </Text>
        )}
      </View>
    </>
  );
}
