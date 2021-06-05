import React from 'react';
import { StyleSheet, View, Text, AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Oswald_400Regular } from '@expo-google-fonts/oswald';

import { Screen, Device, Media, Movie, Playable } from './lib/models';

import MoviesListScreen from './lib/screens/movies';
import CastScreen from './lib/screens/cast';

import { Toast } from './lib/components/toast';
import DrawerContents from './lib/components/drawer';
import { Socket } from './lib/communication/socket';
import { MessageType } from './lib/communication/types';

import Colours from './lib/colours';


const Drawer = createDrawerNavigator();

interface State {
    ready: boolean;
    selectedDevice: Device | null;
    error: string | null;
    status: AppStateStatus;

    devices: Device[];
    movies: Movie[];

    selectedMedia: Media | null;
    selectedPlayable: Playable | null;
}

export default class App extends React.Component<{}, State> {
    private toast: Toast;

    private onAppStateChangeHandler: (state: AppStateStatus) => void;
    private onDeviceStatusMessageHandler: (payload: any) => void;
    private onDevicesReceivedHandler: (payload: ({ devices: Device[] })) => void;
    private onMoviesReceivedHandler: (payload: ({ movies: Movie[] })) => void;

    state = {
        ready: false,
        selectedDevice: null,
        error: null,
        status: 'inactive' as AppStateStatus,

        devices: [],
        movies: [],

        selectedMedia: null,
        selectedPlayable: null
    }

    async componentDidMount() {
        try {
            AppState.addEventListener('change', this.onAppStateChangeHandler = (state: AppStateStatus) => this.onAppStateChange(state));
            // Socket.on(MessageType.DeviceStatusResponse, this.onDeviceStatusMessageHandler = this.onDeviceStatusMessage.bind(this));

            Socket.onAll<{ devices: Device[] }>(MessageType.GetDevicesResponse, this.onDevicesReceivedHandler = this.onDevicesReceived.bind(this));
            Socket.onAll<{ movies: Movie[] }>(MessageType.GetMoviesResponse, this.onMoviesReceivedHandler = this.onMoviesReceived.bind(this));

            await Font.loadAsync({ 'Oswald': Oswald_400Regular })

            this.setState({ ready: true });
        } catch (e) {
            this.setState({ error: e.message + '\r\n\r\n' + e.stack, ready: true });
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.onAppStateChangeHandler);
        Socket.off(MessageType.DeviceStatusResponse, this.onDeviceStatusMessageHandler);
        Socket.off(MessageType.GetDevicesResponse, this.onDevicesReceivedHandler);
        Socket.off(MessageType.GetMoviesResponse, this.onMoviesReceivedHandler);
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
                                activeDevices={this.state.devices}
                            />
                        )}
                    >
                        <Drawer.Screen name={Screen.Movies}>
                            {props => <MoviesListScreen
                                navigation={props.navigation}
                                devices={this.state.devices}
                                movies={this.state.movies}
                                onError={(message: string) => this.toast.error(message)}
                            />}
                        </Drawer.Screen>
                        <Drawer.Screen name={Screen.Cast}>
                            {props => <CastScreen
                                route={props.route}
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
            Socket.emit(MessageType.GetDevicesRequest);
            Socket.emit(MessageType.GetMoviesRequest);
        }
    }

    private onDeviceStatusMessage(payload: any) {
        const devices = [...this.state.devices],
            device = devices.find((device: Device) => device.id === payload.device) as Device | undefined;

        // if (device)
        //     device.media = payload.media;

        this.setState({ devices });
    }

    private onDevicesReceived(payload: ({ devices: Device[] })) {
        this.setState({ devices: payload.devices.map((raw: any) => Device.fromRaw(raw)) });
    }

    private onMoviesReceived(payload: ({ movies: Movie[] })) {
        this.setState({ movies: payload.movies.map((raw: any) => Movie.fromRaw(raw)) });
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
