import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import MoviesScreen from './lib/screens/movies';

import { Oswald_400Regular } from '@expo-google-fonts/oswald';

const Drawer = createDrawerNavigator();

interface IAppState {
    ready: boolean;
}

export default class App extends React.Component<{}, IAppState> {
    state = {
        ready: false
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Oswald': Oswald_400Regular
        });

        this.setState({ ready: true });
    }

    render() {
        return this.state.ready ? <NavigationContainer>
            <StatusBar
                style='light'
            />

            <Drawer.Navigator
                initialRouteName={'Movies'}
                drawerStyle={styles.drawer}
                drawerContentOptions={{
                    activeTintColor: '#0398fc',
                    inactiveTintColor: '#ffffff'
                }}
            >
                <Drawer.Screen name='Movies'>
                    {props => <MoviesScreen
                        navigation={props.navigation}
                    />}
                </Drawer.Screen>
            </Drawer.Navigator>
        </NavigationContainer> : <AppLoading />;
    }
}

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#333333'
    }
});
