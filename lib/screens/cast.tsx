import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import io, { Socket } from 'socket.io-client';

import { Device, Media, Playable, DeviceService, Castable, PlayOptions, PlayableType, CastState } from 'showveo-lib';

import BaseScreen from './base';
import Colours from '../colours';


interface CastScreenProps {
    navigation: any;
    media: Media | null;
    playable: Playable | null;
    device: Device | null;
    onError: (error: string) => void;
}

interface CastScreenState {
    subtitles: boolean;
    resume: boolean;
    elapsed: number;
    loading: boolean;
    paused: boolean;
}

export default class CastScreen extends React.Component<CastScreenProps, CastScreenState> {
    private castable: Castable | null;
    private timeInterval: any;
    private onStatusHandler: any;
    private socket: Socket;

    state = {
        subtitles: false,
        resume: true,
        elapsed: 0,
        loading: true,
        paused: false
    }

    async componentDidMount() {
        try {
            this.castable = new Castable(
                this.props.playable as Playable,
                new PlayOptions(this.props.device as Device, false, false)
            );

            this.socket = io('https://api.showveo.com');
            this.onStatusHandler = this.onStatus.bind(this);
            this.socket.on('status', this.onStatusHandler);

            await DeviceService.cast(this.castable);
        } catch (e) {
            this.props.onError('An error has occurred while casting. Please try again later.');
            this.props.navigation.navigate('movies');
        }
    }

    componentWillUnmount() {
        this.socket.off('status', this.onStatusHandler);
    }

    render() {
        const { media, playable, device } = this.props,
            loading = this.state.loading;

        return media && playable && device ? <BaseScreen
            title={device.name}
            navigation={this.props.navigation}
            back={true}
            loading={this.state.loading}
        >
            <View style={styles.container}>
                <Text style={styles.title}>{media.name}</Text>

                <View style={styles.genreContainer}>
                    {media.genres.map((genre: string) => <Text key={genre} style={styles.genre}>{genre}</Text>)}
                </View>

                <Text style={styles.synopsis}>{media.synopsis}</Text>

                <View style={styles.controls}>
                    <View style={styles.progressContainer}>
                        <Slider
                            style={styles.progressSlider}
                            minimumValue={0}
                            maximumValue={playable.runtime}
                            minimumTrackTintColor={loading ? Colours.background.light : Colours.highlight.default}
                            maximumTrackTintColor={loading ? Colours.background.light : Colours.highlight.dark}
                            thumbTintColor={loading ? Colours.background.light : Colours.highlight.default}
                            disabled={this.state.loading}
                            value={this.state.elapsed}
                            onValueChange={(time: number) => this.setState({ elapsed: time })}
                            onSlidingComplete={(time: number) => this.onSeek(time)}
                        />

                        <View style={styles.timeContainer}>
                            <Text style={[styles.timeElapsed, loading ? styles.loadingText : {}]}>{this.toTimeString(this.state.elapsed)}</Text>
                            <Text style={[styles.timeRemaining, loading ? styles.loadingText : {}]}>{this.toTimeString(playable.runtime)}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={styles.buttonWrapper}
                            disabled={this.state.loading}
                            onPress={() => this.onSeek(Math.max(0, this.state.elapsed - 30))}
                        >
                            <Ionicons
                                style={[styles.buttonIcon, styles.seekBackButtonIcon, loading ? styles.loadingText : {}]}
                                name='md-reload-outline'
                                color={Colours.text.default}
                                size={40}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonWrapper}
                            disabled={this.state.loading}
                            onPress={() => this.onPlayClicked()}
                        >
                            <Ionicons
                                style={[styles.buttonIcon, loading ? styles.loadingText : {}]}
                                name={`md-${this.state.paused ? 'play' : 'pause'}-outline` as any}
                                color={Colours.text.default}
                                size={40}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonWrapper}
                            disabled={this.state.loading}
                            onPress={() => this.onSeek(Math.min(playable.runtime, this.state.elapsed + 30))}
                        >
                            <Ionicons
                                style={[styles.buttonIcon, loading ? styles.loadingText : {}]}
                                name='md-reload-outline'
                                color={Colours.text.default}
                                size={40}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </BaseScreen> : <View />;
    }

    private toTimeString = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds/60/60).toString().padStart(2, '0'),
            minutes = Math.floor(totalSeconds/60%60).toString().padStart(2, '0'),
            seconds = Math.round(totalSeconds%60).toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    private onStatus(message: any) {
        this.setState({
            loading: message.state === 'BUFFERING' || message.state === 'IDLE',
            paused: message.state === 'PAUSED',
            elapsed: message.elapsed
        });

        if (this.timeInterval)
            clearInterval(this.timeInterval);

        if (message.state === 'PLAYING')
            this.timeInterval = setInterval(() => this.setState({ elapsed: this.state.elapsed+1 }), 1000);
    }

    private async onPlayClicked() {
        if (!this.props.device) return;

        clearInterval(this.timeInterval);

        const device = this.props.device;
        this.state.paused ?
            await DeviceService.play(device) :
            await DeviceService.pause(device);

        this.setState({ paused: !this.state.paused });
    }

    private async onSeek(time: number) {
        if (!this.props.device) return;
        await DeviceService.seek(this.props.device, time);
    }
}

const time = {
    flex: 1,
    fontSize: 14,
    color: Colours.text.default
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },

    title: {
        fontFamily: 'Oswald',
        fontSize: 32,
        color: Colours.text.default,
        textTransform: 'uppercase'
    },

    genreContainer: {
        marginTop: 15,
        flexDirection: 'row'
    },

    genre: {
        borderRadius: 5,
        backgroundColor: Colours.highlight.dark,
        color: Colours.text.default,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 8,
        fontSize: 12
    },

    synopsis: {
        fontSize: 16,
        color: Colours.text.lowlight,
        marginTop: 15
    },

    controls: {
        flex: 1,
        justifyContent: 'flex-end'
    },

    progressContainer: {
        height: 60,
    },

    progressSlider: {
        flex: 2,
        alignSelf: 'stretch'
    },

    timeContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10
    },

    timeElapsed: {
        ...time
    },

    timeRemaining: {
        ...time,
        textAlign: 'right'
    },

    buttonsContainer: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        height: 100
    },

    buttonWrapper: {
        flex: 1,
        alignItems: 'center',
        padding: 30
    },

    buttonIcon: {
    },

    seekBackButtonIcon: {
        transform: [
            { rotateY: '180deg' }
        ]
    },

    loadingText: {
        color: Colours.text.disabled
    },

    loadingButton: {
    }
});