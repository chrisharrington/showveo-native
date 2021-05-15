import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Animated, Easing } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Device, Media, Movie, MovieService } from 'showveo-lib';

import CastScreen from '../cast';
import Colours from '../../colours';
import Slider from '../../components/slider';

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
    selectedMedia: Media | null;
}

export default class MoviesScreen extends React.Component<MoviesScreenProps, MoviesScreenState> {
    private slider: Slider<Device>;

    state = {
        loading: true,
        movies: [],
        tileWidth: 0,
        deviceListVisible: false,
        devicesHeight: 0,
        devicesPosition: new Animated.Value(0),
        selectedMedia: null
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
                    {props => <MoviesListScreen
                        navigation={props.navigation}
                        movies={this.state.movies}
                        onClick={(media: Media) => this.onMediaSelected(media)}
                    />}
                </Stack.Screen>
                {/* <Stack.Screen name='cast'>
                    {props => <CastScreen
                        navigation={props.navigation}
                        media={(props.route.params as any).media}
                    />}
                </Stack.Screen> */}
            </Stack.Navigator>

            <Slider<Device>
                ref={c => this.slider = c as Slider<Device>}
                renderItem={this.renderDevice}
                keyExtractor={(device: Device) => device.id}
                data={this.props.devices}
            />
        </View>;
    }

    private renderDevice = ({ item, index } : { item: Device, index: number }) => (
        <TouchableOpacity
            style={[styles.device, index === 0 ? styles.first : {}]}
            key={item.id}
            onPress={() => {}}
        >
            <Text style={{ color: Colours.text.default }}>{item.name}</Text>
        </TouchableOpacity>
    );

    private onMediaSelected(media: Media) {
        this.setState({
            selectedMedia: media
        });

        this.slider.show();
    }
}

const dimensions = Dimensions.get('window');

const styles = StyleSheet.create({
    device: {
        flex: 1,
        borderTopWidth: 1,
        borderTopColor: Colours.border.default,
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
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: 'black'
    }
});
