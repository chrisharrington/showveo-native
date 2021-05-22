import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TouchableHighlight } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Device, Movie, MovieService } from 'showveo-lib';

import CastScreen from '../cast';
import Colours from '../../colours';
import Menu from '../../components/menu';
import Dimensions from '../../components/dimensions';

import MoviesListScreen from './list';


const Stack = createStackNavigator();


interface MoviesScreenProps {
    navigation: any;
    devices: Device[];
    selectedDevice: Device | null;
    onError: (message: string) => void;
    onDeviceSelected: (device: Device) => void;
}

interface MoviesScreenState {
    loading: boolean;
    movies: Movie[];
    tileWidth: number;
    deviceListVisible: boolean;
    devicesHeight: number;
    devicesPosition: Animated.Value;
    selectedMovie: Movie | null;
    selectedDevice: Device | null;
}

export default class MoviesScreen extends React.Component<MoviesScreenProps, MoviesScreenState> {
    private slider: Menu<Device>;

    state = {
        loading: true,
        movies: [],
        tileWidth: 0,
        deviceListVisible: false,
        devicesHeight: 0,
        devicesPosition: new Animated.Value(0),
        selectedMovie: null,
        selectedDevice: null
    }

    async componentDidMount() {
        try {
            this.setState({
                loading: false,
                movies: await MovieService.getAll(0, 1000)
            });
        } catch (e) {
            console.error(e);
            this.props.onError('An error has occurred while retrieving the list of movies. Please try again later.');
        }
    }

    render() {
        return <View style={{ flex: 1 }}>
            <Stack.Navigator
                initialRouteName='movies'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='movies'>
                    {props => <>
                        <MoviesListScreen
                            navigation={props.navigation}
                            movies={this.state.movies}
                            onClick={(movie: Movie) => this.onMovieSelected(movie)}
                        />

                        <Menu<Device>
                            ref={c => this.slider = c as Menu<Device>}
                            renderItem={({ item, index }) => this.renderDevice(item, index, props)}
                            keyExtractor={(device: Device) => device.id}
                            data={this.props.devices}
                        />
                    </>}
                </Stack.Screen>
                <Stack.Screen name='cast'>
                    {props => <CastScreen
                        navigation={props.navigation}
                        media={this.state.selectedMovie}
                        playable={this.state.selectedMovie}
                        device={this.state.selectedDevice}
                        onError={this.props.onError}
                    />}
                </Stack.Screen>
            </Stack.Navigator>
        </View>;
    }

    private renderDevice = (device: Device, index: number, props: any) => (
        <View style={styles.deviceContainer}>
            <TouchableOpacity
                style={[styles.device, index === 0 ? styles.first : {}]}
                key={device.id}
                onPress={() => this.onDeviceSelected(device, props)}
            >
                <Text style={{ color: Colours.text.default }}>{device.name}</Text>
            </TouchableOpacity>
        </View>
    );

    private onMovieSelected(movie: Movie) {
        this.setState({ selectedMovie: movie });
        this.slider.show();
    }

    private onDeviceSelected(device: Device, props: any) {
        this.setState({ selectedDevice: device });
        props.navigation.navigate('cast');
        this.slider.hide();
    }
}

const styles = StyleSheet.create({
    deviceContainer: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: Colours.border.default
    },

    device: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15
    },

    first: {
        borderTopWidth: 0
    },

    overlay: {
        position: 'absolute',
        zIndex: 2,
        elevation: 2,
        width: Dimensions.width(),
        height: Dimensions.height(),
        backgroundColor: 'black'
    }
});
