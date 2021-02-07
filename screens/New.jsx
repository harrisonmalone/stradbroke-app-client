import React, { useState, useContext } from "react";
import { Text, View, Keyboard } from "react-native";
import {
  Input,
  RadioGroup,
  Radio,
  Button,
  Datepicker,
} from "@ui-kitten/components";
import AppContext from "../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvVars from "../environment";

export function New({ navigation }) {
  const { refreshSubscriptions } = useContext(AppContext);
  const { apiUrl } = getEnvVars();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("");
  const [date, setDate] = useState("");

  async function onSubmitPress() {
    const billingPeriod = ["monthly", "yearly"][period];
    const newSubscription = {
      name: name.trim(),
      price: parseInt(price.trim()),
      billing_period: billingPeriod,
      billing_date: date.toLocaleDateString(),
    };
    const token = await AsyncStorage.getItem("userToken");
    await fetch(`${apiUrl}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSubscription),
    });
    await refreshSubscriptions();
    navigation.navigate("Home");
  }

  return (
    <View>
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
          New Subscription
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
      <View style={{ margin: 15, justifyContent: "center" }}>
        <Input
          value={name}
          label={(evaProps) => (
            <Text
              style={{
                color: "gray",
                fontWeight: "800",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              Name
            </Text>
          )}
          placeholder="Netflix"
          onChangeText={(nextValue) => setName(nextValue)}
        />
        <Input
          value={price}
          label={(evaProps) => (
            <Text
              style={{
                color: "gray",
                fontWeight: "800",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              Price
            </Text>
          )}
          placeholder="50"
          onChangeText={(nextValue) => setPrice(nextValue)}
          keyboardType="number-pad"
        />
        <Text
          style={{
            color: "gray",
            fontWeight: "800",
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          Period
        </Text>
        <RadioGroup
          selectedIndex={period}
          onChange={(index) => {
            Keyboard.dismiss();
            setPeriod(index);
          }}
        >
          <Radio>Monthly</Radio>
          <Radio>Yearly</Radio>
        </RadioGroup>
        <View>
          <Text
            style={{
              color: "gray",
              fontWeight: "800",
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            Next Billing Date
          </Text>
          <View style={{ width: "100%" }}>
            <Datepicker
              date={date}
              placement="right end"
              onPress={() => Keyboard.dismiss()}
              onSelect={(nextDate) => {
                setDate(nextDate);
              }}
            />
          </View>
        </View>
        <Button style={{ marginTop: 10 }} onPress={onSubmitPress} appearance="outline">
          Submit
        </Button>
      </View>
    </View>
  );
}
