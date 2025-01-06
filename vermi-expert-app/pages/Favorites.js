import { StyleSheet, View, Text } from "react-native";

const Favorites = () => {
  return(
    <View style={styles.main}>
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>FAVORITES</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

})

export default Favorites;