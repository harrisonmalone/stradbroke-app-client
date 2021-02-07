import React, { useContext } from "react";
import { View, Text } from "react-native";
import {} from "@ui-kitten/components";
import AppContext from "../context/AppContext";
import _ from "lodash";

export function Stats({ navigation }) {
  const { subscriptions } = useContext(AppContext);

  const yearlyPrices = [];
  let monthlySum = subscriptions.reduce((acc, cv) => {
    if (cv.billing_period === "yearly") {
      yearlyPrices.push(cv.price);
      return acc + 0;
    } else {
      return acc + parseInt(cv.price);
    }
  }, 0);
  const total = Math.ceil(_.sum(yearlyPrices) / 12) + monthlySum;

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
            color: "white"
          }}
        >
          Stats
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
            padding: 15,
          }}
        >
          <Text>Per Week: ${Math.ceil((total * 12) / 52)}</Text>
          <Text>Per Month: ${total}</Text>
          <Text>Per Year: ${total * 12}</Text>
        </View>
      </View>
    </>
  );
}
