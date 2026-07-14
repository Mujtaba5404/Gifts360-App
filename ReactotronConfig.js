import Reactotron from "reactotron-react-native";

Reactotron
  .configure({
    host: "10.10.243.55",
  })
  .useReactNative()
  .connect();

console.tron = Reactotron;

export default Reactotron;