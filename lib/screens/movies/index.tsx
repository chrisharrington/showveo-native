import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Castable, Device, Movie, Navigation, PlayOptions, Screen } from '@lib/models';
import DeviceService from '@lib/data/devices';
import Colours from '@lib/colours';;
import Menu from '@lib/components/menu';
import Dimensions from '@lib/components/dimensions';
import { Socket } from '@lib/communication/socket';
import { MessageType, CastMessageRequest } from '@lib/communication/types';

import MoviesListScreen from './list';


interface MoviesScreenProps {
    navigation: Navigation;
    devices: Device[];
    movies: Movie[];
    onError: (message: string) => void;
}

interface MoviesScreenState {
    loading: boolean;
    movie: Movie | null;
}

export default class MoviesScreen extends React.Component<MoviesScreenProps, MoviesScreenState> {
    private slider: Menu<Device>;

    state = {
        loading: true,
        movie: null
    }

    render() {
        return <View style={{ flex: 1 }}>
            <MoviesListScreen
                navigation={this.props.navigation}
                movies={this.props.movies}
                onClick={(movie: Movie) => this.onMovieSelected(movie)}
            />

            <Menu<Device>
                ref={c => this.slider = c as Menu<Device>}
                renderItem={({ item, index }) => this.renderDevice(item, index)}
                keyExtractor={(device: Device) => device.id}
                data={this.props.devices}
            />
        </View>;
    }

    private renderDevice = (device: Device, index: number) => (
        <View style={styles.deviceContainer}>
            <TouchableOpacity
                style={[styles.device, index === 0 ? styles.first : {}]}
                key={device.id}
                onPress={() => this.onDeviceSelected(device)}
            >
                <Text style={{ color: Colours.text.default }}>{device.name}</Text>
            </TouchableOpacity>
        </View>
    );

    private onMovieSelected(movie: Movie) {
        this.setState({ movie });
        this.slider.show();
    }

    private async onDeviceSelected(device: Device) {
        const movie = this.state.movie as Movie | null;
        if (!movie) return;

        this.slider.hide();

        Socket.emit(MessageType.CastRequest, { movieId: movie._id, host: device.host });

        this.props.navigation.navigate(Screen.Cast, { device, movie });
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
