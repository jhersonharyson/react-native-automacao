import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  Animated,
  Image,
  ScrollView
} from "react-native";
var _ = require("lodash");
import BluetoothSerial from "react-native-bluetooth-serial";

import search from "./../../assets/imagens/search.png";
import bluetooth from "./../../assets/imagens/bluetooth.png";
import light from "./../../assets/imagens/light.png";
import power from "./../../assets/imagens/power.png";
import voice from "./../../assets/animations/voice.json";
import circle from "./../../assets/animations/circle.json";
import wave from "./../../assets/animations/wave.json";
import bg from "./../../assets/animations/bg.json";

import LottieView from "lottie-react-native";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
      name: null,
      listAll: false,
      resize: false,
      animationText1: new Animated.Value(0),
      animationText2: new Animated.Value(0),
      animationText3: new Animated.Value(0),
      animationText4: new Animated.Value(1)
    };
  }

  componentDidMount() {
    Animated.timing(this.state.animationText1, {
      toValue: 1,
      duration: 3000
    }).start();
    Animated.timing(this.state.animationText2, {
      toValue: 1,
      duration: 2000,
      delay: 4500
    }).start();
    Animated.timing(this.state.animationText3, {
      toValue: 1,
      duration: 2000,
      delay: 8000
    }).start();
    Animated.timing(this.state.animationText4, {
      toValue: 0,
      duration: 2000,
      delay: 15000
    }).start();
    setTimeout(_ => {
      this.setState({ resize: true });
    }, 16000);
  }

  componentWillMount() {
    Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
      values => {
        const [isEnabled, devices] = values;

        this.setState({ isEnabled, devices });
      }
    );

    BluetoothSerial.on("bluetoothEnabled", () => {
      Promise.all([BluetoothSerial.isEnabled(), BluetoothSerial.list()]).then(
        values => {
          const [isEnabled, devices] = values;
          this.setState({ devices });
        }
      );

      BluetoothSerial.on("bluetoothDisabled", () => {
        this.setState({ devices: [] });
      });
      BluetoothSerial.on("error", err => console.log(`Error: ${err.message}`));
    });
  }
  connect(device) {
    this.setState({ connecting: true });
    BluetoothSerial.connect(device.id)
      .then(res => {
        console.log(`Conectado ao dispositivo ${device.name}`);
        this.setState({ name: device.name || device.id, listAll: false });
        ToastAndroid.show(
          `Conectado ao dispositivo ${device.name || device.id}`,
          ToastAndroid.SHORT
        );
      })
      .catch(err => {
        console.log(err.message);
        this.setState({ name: null, listAll: false });
      });
  }
  _renderItem(item) {
    return (
      <TouchableOpacity onPress={() => this.connect(item.item)}>
        <View style={styles.deviceNameWrap}>
          <Image
            source={light}
            style={[{ width: 20, height: 20, marginRight: 7.5 }]}
          />
          <Text style={styles.deviceName}>
            {item.item.name ? item.item.name : item.item.id}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  enable() {
    BluetoothSerial.enable()
      .then(res => this.setState({ isEnabled: true }))
      .catch(err => Toast.showShortBottom(err.message));
  }

  disable() {
    BluetoothSerial.disable()
      .then(res => this.setState({ isEnabled: false }))
      .catch(err => Toast.showShortBottom(err.message));
  }

  toggleBluetooth(value) {
    if (value === true) {
      this.enable();
    } else {
      this.disable();
    }
  }
  discoverAvailableDevices() {
    if (this.state.discovering) {
      return false;
    } else {
      this.setState({ discovering: true });
      BluetoothSerial.discoverUnpairedDevices()
        .then(unpairedDevices => {
          const uniqueDevices = _.uniqBy(unpairedDevices, "id");
          console.log(uniqueDevices);
          this.setState({ unpairedDevices: uniqueDevices, discovering: false });
        })
        .catch(err => console.log(err.message));
    }
  }
  toggleSwitch() {
    BluetoothSerial.write("T")
      .then(res => {
        console.log(res);
        console.log("Successfuly wrote to device");
        this.setState({ connected: true });
      })
      .catch(err => console.log(err.message));
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#0256d3" }}>
        <View style={styles.container}>
          <LottieView
            source={wave}
            speed={0.15}
            style={{ opacity: 0.6 }}
            autoPlay
            loop
          />
          <View
            style={[
              styles.toolbar,
              {
                backgroundColor: "#fff",
                borderRadius: 20,
                margin: 15,
                paddingHorizontal: 30
              }
            ]}
          >
            <Animated.View
              style={{
                opacity: this.state.animationText1
              }}
            >
              <Text
                style={[
                  styles.toolbarTitle,
                  { fontSize: 38, fontWeight: "400", marginVertical: 15 }
                ]}
              >
                Segunda-feira{"\n"}
              </Text>
              <LottieView
                source={circle}
                speed={0.5}
                style={{ marginTop: this.state.resize ? 30 : 20 }}
                autoPlay
                loop
              />
              <Animated.View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: this.state.animationText4
                }}
              >
                <Animated.View
                  style={{
                    opacity: this.state.animationText2
                  }}
                >
                  <Text
                    style={[
                      styles.toolbarTitle,
                      { fontSize: 18, fontWeight: "400" }
                    ]}
                  >
                    Olá...{" "}
                  </Text>
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: this.state.animationText3
                  }}
                >
                  <Text
                    style={[
                      styles.toolbarTitle,
                      { fontSize: 18, fontWeight: "400" }
                    ]}
                  >
                    Sou sua assistente pessoal
                  </Text>
                </Animated.View>
              </Animated.View>
            </Animated.View>
          </View>
          <View style={[styles.toolbarBluetooth, { marginTop: 10 }]}>
            <View>
              <Text
                style={[
                  styles.toolbarTitleBluetooth,
                  { color: "#fff", textAlign: "left", marginLeft: 20 }
                ]}
              >
                Pesquisar
              </Text>
              <TouchableOpacity
                onPress={this.discoverAvailableDevices.bind(this)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#4baafb",
                  borderRadius: 20,
                  margin: 15,
                  padding: 15,
                  height: 95,
                  width: 170
                }}
              >
                <Image source={search} style={[{ width: 60, height: 60 }]} />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={[
                  styles.toolbarTitleBluetooth,
                  { textAlign: "left", marginLeft: 20, color: "#fff" }
                ]}
              >
                Bluetooth
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  margin: 15,
                  padding: 15,
                  height: 95,
                  width: 170
                }}
              >
                <Image source={bluetooth} style={[{ width: 60, height: 60 }]} />
                <Switch
                  // thumbColor=""

                  trackColor="#29b5a8"
                  // onTintColor=""
                  // tintColor="#29b5a8"
                  // thumbTintColor=""
                  style={{
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                    margin: 15
                  }}
                  value={this.state.isEnabled}
                  onValueChange={val => this.toggleBluetooth(val)}
                />
              </View>
            </View>
          </View>
          {this.state.isEnabled && (
            <>
              {this.state.name == null || this.state.listAll ? (
                <>
                  <Text
                    style={[
                      styles.toolbarTitleBluetooth,
                      {
                        textAlign: "left",
                        marginLeft: 20,
                        marginTop: 10,
                        color: "#fff"
                      }
                    ]}
                  >
                    Dispositivos
                  </Text>
                  <FlatList
                    style={{
                      flex: 1,
                      backgroundColor: "#fff",
                      margin: 20,
                      borderRadius: 20,
                      padding: 7.5,
                      minHeight: 100
                    }}
                    data={this.state.devices}
                    keyExtractor={item => item.id}
                    renderItem={item => this._renderItem(item)}
                  />
                </>
              ) : (
                <TouchableOpacity
                onPress={_=>this.setState({listAll: true})}
                style={{justifyContent: "center", alignItems: "center", backgroundColor:"#fff", marginHorizontal: 15, padding: 20, borderRadius: 20}}
                >
                  <Text
                  style={[
                    styles.toolbarTitleBluetooth,
                    {
                      textAlign: "center",
                      color: "black",
                    }
                  ]}
                >
                  Ver todos os dispositivos </Text>
                </TouchableOpacity>
              )}
              {this.state.name != null && (
                <Text
                  style={[
                    styles.toolbarTitleBluetooth,
                    {
                      textAlign: "left",
                      marginTop: 10,
                      marginLeft: 20,
                      color: "#fff"
                    }
                  ]}
                >
                  Conectado em {this.state.name}
                </Text>
              )}
              <View
                style={[
                  styles.toolbar,
                  {
                    backgroundColor: "#fff",
                    borderRadius: 20,
                    margin: 15,

                    paddingHorizontal: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 115
                  }
                ]}
              >
                {this.state.name != null ? (
                  <TouchableOpacity
                    onPress={this.toggleSwitch.bind(this)}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Image
                      source={power}
                      style={[{ width: 90, height: 90, marginTop: 7.5 }]}
                    />
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={[
                      {
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "400",
                        color: "#f44336"
                      }
                    ]}
                  >
                    Nenhum dispositivo controlado
                  </Text>
                )}
              </View>
              {/* <Button
             
              title="Switch(On/Off)"
              color="#841584"
            /> */}
            </>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center"
  },
  toolbar: {
    paddingTop: 20,
    paddingBottom: 30,
    flexDirection: "column",
    justifyContent: "center"
  },
  toolbarTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 6,
    color: "black"
  },
  toolbarTitleBluetooth: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black"
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    borderBottomWidth: 1
  },
  toolbarBluetooth: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});
