import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Device, Media, Movie, MovieService } from 'showveo-lib';

import MoviesListScreen from './list';
import OptionsScreen from '../options';

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
}

export default class MoviesScreen extends React.Component<MoviesScreenProps, MoviesScreenState> {
    state = {
        loading: true,
        movies: [],
        tileWidth: 0
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
        return <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='movies'>
                {props => <MoviesListScreen
                    navigation={props.navigation}
                    onClick={(media: Media) => props.navigation.navigate('options', { media })}
                />}
            </Stack.Screen>
            <Stack.Screen name='options'>
                {props => <OptionsScreen
                    navigation={props.navigation}
                    media={(props.route.params as any).media}
                    devices={this.props.devices}
                    selectedDevice={this.props.selectedDevice}
                    onDeviceSelected={(device: Device) => this.props.onDeviceSelected(device)}
                />}
            </Stack.Screen>
        </Stack.Navigator>;
    }
}