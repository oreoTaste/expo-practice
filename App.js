import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { Ionicons, Feather, Fontisto } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("screen")
const getRand = () => Math.random() * parseInt(255 / 2)
const API_ID = '784ab24ff2ed5d94d4288abed9e25d13'
const codes = {
  "Rain": 'rains',
  "Snow" : 'snowflake',
  "Clear" : "day-sunny",
  "Drizzle": "rain",
  "Clouds": 'cloudy'
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [weathers, setWeathers] = useState([]);

  useEffect(async () => {  
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
  
    const {coords: { latitude, longitude }} = await Location.getCurrentPositionAsync({accuracy: 5});
    const [{city, region}] = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(`${region} ${city}`)

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_ID}&units=metric`).then((el) => el.json()).then((json) => {
      setWeathers(json["daily"])
    })
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        {city?.split(' ').map((el, ind) => <Text key={ind} style={[styles.cityName, styles.text].map(el2 => el2)}>{el}</Text>)}
      </View>
      <ScrollView horizontal scrollEnabled pagingEnabled contentContainerStyle={styles.weather}>
      {weathers?.map((el, ind) => {
        return(
        <View style={styles.day} key={ind}>
          <View style={styles.tempBox}>
          <Text style={[styles.temp, styles.text].map(el2 => el2)}>{parseFloat(el.temp.day).toFixed(1)}</Text>
          <Fontisto
                name={codes[el.weather[0].main]}
                size={68}
                color="white"
                style={[styles.text].map(el2 => el2)}
              />
          </View>
          <Text style={[styles.description, styles.text].map(el2 => el2)}>{el.weather[0].main}</Text>
          <Text style={[styles.tinyText, styles.text].map(el2 => el2)}>{el.weather[0].description}</Text>  
          <Text style={[styles.tinyText, styles.text].map(el2 => el2)}>{`${new Date(el.dt * 1000).getMonth()}월 ${new Date(el.dt * 1000).getDate()}일`}</Text>  
        </View>
        )
      })}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `rgba(${getRand()},${getRand()},${getRand()}, 0.5)`
  },
  city: {
    flex: 1.2,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weather: {
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  tempBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
    justifyContent: "space-between",
  },
  cityName: {
    fontWeight: '500',
    fontSize: 52,
    color: 'white',
    padding: 5
  },
  text: {
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },

});
