import React from 'react';
import { StyleSheet, View, Text, AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';

import { Device, DeviceService, Media, Movie, Playable } from 'showveo-lib';
import { Screen, Navigation } from './lib/models';

import MoviesListScreen from './lib/screens/movies';
import CastScreen from './lib/screens/cast';

import { Toast } from './lib/components/toast';
import DrawerContents from './lib/components/drawer';

import Colours from './lib/colours';


const Drawer = createDrawerNavigator();

interface State {
    ready: boolean;
    devices: Device[];
    selectedDevice: Device | null;
    error: string | null;
    status: AppStateStatus;

    selectedMedia: Media | null;
    selectedPlayable: Playable | null;
}

export default class App extends React.Component<{}, State> {
    private toast: Toast;
    private onAppStateChangeHandler: (state: AppStateStatus) => void;

    state = {
        ready: false,
        devices: [],
        selectedDevice: null,
        error: null,
        status: 'inactive' as AppStateStatus,
        selectedMedia: null,
        selectedPlayable: null
    }

    async componentDidMount() {
        try {
            AppState.addEventListener('change', this.onAppStateChangeHandler = (state: AppStateStatus) => this.onAppStateChange(state));

            await Font.loadAsync({ 'Oswald': Oswald_400Regular });
            const devices = await DeviceService.getAll();

            this.setState({
                ready: true,
                devices
            });
        } catch (e) {
            this.setState({ error: e.message + '\r\n\r\n' + e.stack, ready: true });
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.onAppStateChangeHandler);
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
                        // openByDefault={true}
                        drawerContent={props => (
                            <DrawerContents
                                routes={props.state.routes.filter((route => route.name !== Screen.Cast))}
                                navigation={props.navigation}
                                activeDevices={this.state.devices.filter((device: Device) => device.castable)}
                            />
                        )}
                    >
                        <Drawer.Screen name={Screen.Movies}>
                            {props => <MoviesListScreen
                                navigation={props.navigation}
                                devices={this.state.devices}
                                selectedDevice={this.state.selectedDevice}
                                onError={(message: string) => this.toast.error(message)}
                                onMovieSelected={(movie: Movie) => this.setState({ selectedMedia: movie, selectedPlayable: movie })}
                                onDeviceSelected={(device: Device) => this.onDeviceSelected(device, props.navigation as Navigation)}
                            />}
                        </Drawer.Screen>
                        <Drawer.Screen name={Screen.Cast}>
                            {props => <CastScreen
                                navigation={props.navigation}
                                media={this.state.selectedMedia}
                                playable={this.state.selectedPlayable}
                                device={this.state.selectedDevice}
                                onError={(error: string) => this.toast.error(error)}
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

    private async onAppStateChange(status: AppStateStatus) {
        if (this.state.status !== 'active' && status === 'active') {        
            this.setState({
                devices: await DeviceService.getAll()
            });
        }

        this.setState({ status });
    }

    private onDeviceSelected(device: Device, navigation: Navigation) {
        this.setState({ selectedDevice: device });
        navigation.navigate(Screen.Cast);
    }
}

const styles = StyleSheet.create({
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
