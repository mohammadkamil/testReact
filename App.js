/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { RadioButton } from 'react-native-paper';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import BackgroundTimer from 'react-native-background-timer';
import Spinner from 'react-native-loading-spinner-overlay';
const URI = 'http://192.168.1.29:8000';//local network

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button title="Start" onPress={() => this.props.navigation.navigate('Survey')}></Button>

      </View>
    );
  }
} class SurveyScreen extends React.Component {
  state = {
    question1: 0,
    question2: 0,
    question3: 0,
    question4: 0,
    timer: 60,
    loading: false

  };

  questionlabel = [{
    label: "1. What is your age group?",
  }, {
    label: "2. What is your education level?",
  }, {
    label: "3. What is your monthly income?",

  }, {
    label: "4. Your Gender :",

  }];
  radio_props1 = [
    { label: 'a. <18', value: 1 },
    { label: 'b. 18 to 35', value: 2 },
    { label: 'c. 35 to 60', value: 3 },

    { label: 'd. 35 to 60', value: 4 }

  ]; radio_props2 = [
    { label: 'a. Secondary school and below', value: 1 },
    { label: 'b. Diploma', value: 2 },
    { label: 'c. Degree', value: 3 },

    { label: 'd. Post graduate degree', value: 4 }

  ]; radio_props3 = [
    { label: 'a. Less than RM 1000', value: 1 },
    { label: 'b. Between RM1000 to RM3000', value: 2 },
    { label: 'c. Between RM3000 to RM5000', value: 3 },

    { label: 'd. More than RM5000', value: 4 }

  ]; radio_props4 = [
    { label: 'a. Male', value: 1 },
    { label: 'b. Female', value: 2 },


  ];


  componentDidMount() {
    const intervalId = BackgroundTimer.setInterval(() => {
      this.setState({ timer: this.state.timer - 1 });
      if (this.state.timer == 0) {
        BackgroundTimer.clearInterval(intervalId);

        this.props.navigation.navigate('Home');
      }
      console.log('tic');
    }, 1000);

    // Cancel the timer when you are done with it
    // let myInterval = setInterval(() => {
    //   this.setState({ timer: this.state.timer - 1 });
    //   if (this.state.timer == 0) {
    //     clearInterval(myInterval);

    //     this.props.navigation.navigate('Home');
    //   }
    // }, 1000);
  }

  render() {
    return (
      <View style={{ flex: 1, margin: 10 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
        <Text>Timer: {this.state.timer} s</Text>

        <Text>{this.questionlabel[0].label}</Text>

        <RadioForm
          radio_props={this.radio_props1}
          initial={-1}
          onPress={(value) => { this.setState({ question1: value }) }}
          isSelected={false}

        />
        <Text>{this.questionlabel[1].label}</Text>

        <RadioForm
          radio_props={this.radio_props2}
          initial={-1}

          onPress={(value) => { this.setState({ question2: value }) }}
          isSelected={false}

        />
        <Text>{this.questionlabel[2].label}</Text>

        <RadioForm
          radio_props={this.radio_props3}
          initial={-1}

          onPress={(value) => { this.setState({ question3: value }) }}
          isSelected={false}

        />
        <Text>{this.questionlabel[3].label}</Text>

        <RadioForm
          radio_props={this.radio_props4}
          initial={-1}

          onPress={(value) => { this.setState({ question4: value }) }}
          isSelected={false}
        />

        <Button title="Submit" onPress={() => {
          if (this.state.question1 == 0 || this.state.question2 == 0 || this.state.question3 == 0 || this.state.question4 == 0) {

            alert("Please complete survey before submit");
          } else {
            this.setState({ loading: true });
            fetch(URI + '/api/submit', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                question1: this.state.question1,
                question2: this.state.question2,
                question3: this.state.question3,
                question4: this.state.question4,

              }),
            }).then((response) => response.json())
              .then((responseJson) => {
                this.setState({ loading: false });

                this.props.navigation.navigate('Result');
              })
              .catch((error) => {
                console.error(error);
              })
          }
        }

        }></Button>


      </View>
    );
  }
  _onPressButton() {
    alert('You tapped the button!');
  }
}
class ResultScreen extends React.Component {
  // URI = 'http://192.168.1.29:8080';//local network
  state = {
    totalquestion: 0,
    question1a: 0,
    question1b: 0,
    question1c: 0,
    question1d: 0,
    question2a: 0,
    question2b: 0,
    question2c: 0,
    question2d: 0,
    question3a: 0,
    question3b: 0,
    question3c: 0,
    question3d: 0,
    question4a: 0,
    question4b: 0,
    loading: true

  }
  componentWillMount() {

    fetch(URI + '/api/getresult', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          totalquestion: responseJson.data[0].totalquestion1,
          question1a: responseJson.data[0].totalanswer1a,
          question1b: responseJson.data[0].totalanswer1b,
          question1c: responseJson.data[0].totalanswer1c,
          question1d: responseJson.data[0].totalanswer1d,
          question2a: responseJson.data[0].totalanswer2a,
          question2b: responseJson.data[0].totalanswer2b,
          question2c: responseJson.data[0].totalanswer2c,
          question2d: responseJson.data[0].totalanswer2d,
          question3a: responseJson.data[0].totalanswer3a,
          question3b: responseJson.data[0].totalanswer3b,
          question3c: responseJson.data[0].totalanswer3c,
          question3d: responseJson.data[0].totalanswer3d,
          question4a: responseJson.data[0].totalanswer4a,
          question4b: responseJson.data[0].totalanswer4b,
        });
        this.setState({ loading: false });

        // alert(JSON.stringify(responseJson.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }
  render() {
    return (

      <View style={{ flex: 1, margin: 10 }}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={this.state.loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
        <Text>Result Screen</Text>

        <Text>1. Age group</Text>
        <View style={{ flex: 1, marginLeft: 20 }}>

          <Text>a. &lt;18 [Total:{this.state.question1a} | {(this.state.question1a / this.state.totalquestion * 100).toFixed(0)}%]</Text>
          <Text>b. 18 to 35 [Total:{this.state.question1b} | {(this.state.question1b / this.state.totalquestion * 100).toFixed(0)}%]</Text>

          <Text>c. 36 to 60 [Total:{this.state.question1c} | {(this.state.question1c / this.state.totalquestion * 100).toFixed(0)}%]</Text>
          <Text>d. 61 and above [Total:{this.state.question1d} | {(this.state.question1d / this.state.totalquestion * 100).toFixed(0)}%]</Text>
        </View>
        <Text>2. Education Level</Text>
        <View style={{ flex: 1, marginLeft: 20 }}>

          <Text>a. Secondary school and below [Total:{this.state.question2a} | {(this.state.question2a / this.state.totalquestion * 100).toFixed(0)}%]</Text>
          <Text>b. Diploma [Total:{this.state.question2b} | {(this.state.question2b / this.state.totalquestion * 100).toFixed(0)}%]</Text>

          <Text>c. Degree [Total:{this.state.question2c} | {(this.state.question2c / this.state.totalquestion * 100).toFixed(0)}%]</Text>
          <Text>d. Post graduate degree [Total:{this.state.question2d} | {(this.state.question2d / this.state.totalquestion * 100).toFixed(0)}%]</Text>
        </View>
        <Text>3. Income Level</Text>
        <View style={{ flex: 1, marginLeft: 20 }}>

          <Text>a. Less than RM 1000 [Total:{this.state.question3a} | {(this.state.question3a / this.state.totalquestion * 100).toFixed(0)}%]</Text>
          <Text>b. Between RM1000 to RM3000 [Total:{this.state.question3b} | {(this.state.question3b / this.state.totalquestion * 100).toFixed(0)}%]</Text>

          <Text>c. Between RM3000 to RM5000 [Total:{this.state.question3c} | {(this.state.question3c / this.state.totalquestion * 100).toFixed(0)}%]</Text>
          <Text>d. More than RM5000 [Total:{this.state.question3d} | {(this.state.question3d / this.state.totalquestion * 100).toFixed(0)}%]</Text>
        </View>
        <Text>4. Gender</Text>
        <View style={{ flex: 1, marginLeft: 20 }}>

          <Text>a.Male [Total:{this.state.question4a} | {(this.state.question4a / this.state.totalquestion * 100).toFixed(0)}%]</Text>
          <Text>b. Female [Total:{this.state.question4b} | {(this.state.question4b / this.state.totalquestion * 100).toFixed(0)}%]</Text>
        </View>

        <Button title="Home" onPress={() => this.props.navigation.navigate('Home')}></Button>

      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: `Home`,
      headerLeft: null
    }),
  }, Survey: {
    screen: SurveyScreen,
    navigationOptions: ({ navigation }) => ({
      title: `Survey`,
      headerLeft: null

    }),
  }, Result: {
    screen: ResultScreen,
    navigationOptions: ({ navigation }) => ({
      title: `Result`,
      headerLeft: null

    }),
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});
export default createAppContainer(AppNavigator);