import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';

import { Device, DeviceService } from 'showveo-lib';

import MoviesListScreen from './lib/screens/movies';
import { Toast } from './lib/components/toast';


const Drawer = createDrawerNavigator();

interface AppState {
    ready: boolean;
    devices: Device[];
    selectedDevice: Device | null;
}

export default class App extends React.Component<{}, AppState> {
    private toast: Toast;

    state = {
        ready: false,
        devices: [],
        selectedDevice: null
    }

    async componentDidMount() {
        const [_, devices] = await Promise.all([
            Font.loadAsync({ 'Oswald': Oswald_400Regular }),
            DeviceService.getAll()
        ]);

        this.setState({
            ready: true,
            devices,
            selectedDevice: devices[0]
        });
    }

    render() {
        return this.state.ready ? <NavigationContainer theme={{ colors: { background: '#222' }} as any}>
            <StatusBar
                style='light'
            />

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

            <Toast
                ref={c => this.toast = c as Toast}
            />
        </NavigationContainer> : <AppLoading />;
    }
}

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#333333'
    }
});
