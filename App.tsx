import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';

import { Device, DeviceService } from 'showveo-lib';

import MoviesListScreen from './lib/screens/movies';
import { Toast } from './lib/components/toast';
import Colours from './lib/colours';


const Drawer = createDrawerNavigator();

interface AppState {
    ready: boolean;
    devices: Device[];
    selectedDevice: Device | null;
    error: string | null;
}

export default class App extends React.Component<{}, AppState> {
    private toast: Toast;

    state = {
        ready: false,
        devices: [],
        selectedDevice: null,
        error: null
    }

    async componentDidMount() {
        try {
            const [_, devices] = await Promise.all([
                Font.loadAsync({ 'Oswald': Oswald_400Regular }),
                DeviceService.getAll()
            ]);

            this.setState({
                ready: true,
                devices,
                selectedDevice: devices[0]
            });
        } catch (e) {
            this.setState({ error: e.message + '\r\n\r\n' + e.stack, ready: true });
        }
    }

    render() {
        return this.state.ready ? <NavigationContainer theme={{ colors: { background: '#222' }} as any}>
            <StatusBar
                style='light'
            />

            {this.state.error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>An error has occurred.</Text>
                    <Text style={styles.errorCode}>{this.state.error}</Text>
                </View>
            ) : (
                <>
                    <Drawer.Navigator
                        initialRouteName='Movies'
                        drawerStyle={styles.drawer}
                        drawerContentOptions={{
                            activeTintColor: '#0398fc',
                            inactiveTintColor: '#ffffff'
                        }}
                    >
                        <Drawer.Screen name='Movies'>
                            {props => <MoviesListScreen
                                navigation={props.navigation}
                                devices={this.state.devices}
                                selectedDevice={this.state.selectedDevice}
                                onError={(message: string) => this.toast.error(message)}
                                onDeviceSelected={(device: Device) => this.setState({ selectedDevice: device })}
                            />}
                        </Drawer.Screen>
                    </Drawer.Navigator>
                </>
            )}

            <Toast
                ref={c => this.toast = c as Toast}
            />
        </NavigationContainer> : <AppLoading />;
    }
}

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#333333'
    },

    errorContainer: {
        flex: 1,
        backgroundColor: Colours.background.default,
        padding: 25
    },

    errorText: {
        color: Colours.text.default,
        marginTop: 25,
        fontSize: 24
    },

    errorCode: {
        color: Colours.text.lowlight,
        marginTop: 10
    }
});
