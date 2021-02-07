import React, { useContext, useEffect, useState } from "react";
import { Text, View, Alert } from "react-native";
import AppContext from "../context/AppContext";
import moment from "moment";
import { Button } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../environment";

export function Subscription({ navigation, route }) {
  const { refreshSubscriptions, subscriptions } = useContext(AppContext);
  const { apiUrl } = getEnvVars();
  const [subscription, setSubscription] = useState(null);
  const id = route.params.id;

  useEffect(() => {
    const subscription = subscriptions.find(
      (subscription) => subscription.id === id
    );
    setSubscription(subscription);
  }, []);

  function billingDateSentence() {
    const date = moment(subscription.billing_date);
    const month = date.format("MMMM");
    const day = date.format("Do");
    if (subscription?.billing_period === "monthly") {
      return `${day} of each month`;
    } else {
      return `${day} of ${month} this year`;
    }
  }

  function onDeletePress() {
    Alert.alert(
      "Are you sure you wish to delete?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const token = await AsyncStorage.getItem("userToken");
            await fetch(`${apiUrl}/subscriptions/${id}`, {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            await refreshSubscriptions();
            navigation.navigate("Home");
          },
        },
      ],
      { cancelable: false }
    );
  }

  return (
    subscription && (
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
              color: "white"
            }}
          >
            {subscription.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                marginRight: 10,
                color: "white",
                fontSize: 16,
              }}
              onPress={() => navigation.goBack()}
            >
              Back
            </Text>
          </View>
        </View>
        <View>
          <View
            style={{
              backgroundColor: "white",
              padding: 15
            }}
          >
            <Text>Your billing date is on the {billingDateSentence()}</Text>
            <Button
              style={{
                marginTop: 10,
                marginBottom: 10
              }}
              status="danger"
              appearance="outline"
              onPress={onDeletePress}
            >
              Delete
            </Button>
          </View>
        </View>
      </>
    )
  );
}
