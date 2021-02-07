import React from "react";
import { Text, View } from "react-native";
import AppContext from "../context/AppContext";
import { List, ListItem, Divider } from "@ui-kitten/components";

export function Home({ navigation }) {
  const { signOut, subscriptions } = React.useContext(AppContext);

  const renderItem = (subscription) => {
    return (
      <ListItem
        onPress={() =>
          navigation.navigate("Subscription", { id: subscription.item.id })
        }
        title={(evaProps) => (
          <Text {...evaProps}>{subscription.item.name}</Text>
        )}
        description={`$${subscription.item.price} ${subscription.item.billing_period}`}
        style={{ height: 70 }}
      />
    );
  };

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
          Subscriptions
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              marginRight: 10,
              color: "white",
              fontSize: 16,
            }}
            onPress={() => navigation.navigate("New")}
          >
            New
          </Text>
          <Text
            style={{
              marginRight: 10,
              color: "white",
              fontSize: 16,
            }}
            onPress={() => navigation.navigate("Stats")}
          >
            Stats
          </Text>
          <Text
            style={{
              marginRight: 10,
              color: "white",
              fontSize: 16,
            }}
            onPress={() => {
              signOut();
            }}
          >
            Logout
          </Text>
        </View>
      </View>
      <List
        data={subscriptions}
        ItemSeparatorComponent={Divider}
        renderItem={renderItem}
      />
    </>
  );
}
