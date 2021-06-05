import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import { Device, Media, Playable, CastState } from '@lib/models';
import DeviceService from '@lib/data/devices';
import BaseScreen from '@lib/screens/base';
import Colours from '@lib/colours';
import Dimensions from '@lib/components/dimensions';
import { Socket } from '@lib/communication/socket';
import { Navigation, Screen } from '@lib/models';
import { MessageType } from '@lib/communication/types';


interface CastScreenProps {
    navigation: Navigation;
    route: any;
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
    private timeInterval: any;
    private ignoreStatusUpdates: boolean = false;
    
    private onStatusHandler: any;

    state = {
        subtitles: false,
        resume: true,
        elapsed: 0,
        loading: true,
        paused: false
    }

    async componentDidMount() {
        try {
            Socket.onAll(MessageType.DeviceStatusResponse, this.onStatusHandler = this.onStatus.bind(this));
        } catch (e) {
            this.props.onError('An error has occurred while casting. Please try again later.');
            this.props.navigation.navigate(Screen.Movies);
        }
    }

    componentWillUnmount() {
        Socket.off(MessageType.DeviceStatusResponse, this.onStatusHandler);
    }

    render() {
        const params = this.props.route.params,
            media = (params.movie || params.episode) as Media,
            playable = (params.movie || params.episode) as Playable,
            device = params.device as Device,
            loading = this.state.loading;

        return <BaseScreen
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
                    <View style={styles.subtitlesContainer}>
                        <TouchableOpacity
                            style={[styles.subtitlesButton, this.state.subtitles ? styles.subtitlesButtonSelected : {}]}
                            onPress={() => this.onSubtitlesToggled()}
                        >
                            <Text style={styles.subtitlesText}>Subtitles</Text>
                        </TouchableOpacity>
                    </View>

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
        </BaseScreen>;
    }

    private toTimeString = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds/60/60).toString().padStart(2, '0'),
            minutes = Math.floor(totalSeconds/60%60).toString().padStart(2, '0'),
            seconds = Math.round(totalSeconds%60).toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    private onStatus(message: any) {
        if (this.ignoreStatusUpdates) return;

        if (message.state === CastState.Finished) {
           this.props.navigation.goBack();
           return;
        }

        this.setState({
            loading: message.state === CastState.Buffering || message.state === CastState.Idle,
            paused: message.state === CastState.Paused,
            elapsed: message.elapsed
        });

        if (this.timeInterval)
            clearInterval(this.timeInterval);

        if (message.state === CastState.Playing)
            this.timeInterval = setInterval(() => this.setState({ elapsed: this.state.elapsed+1 }), 1000);
    }

    private async onPlayClicked() {
        const device = this.props.route?.params?.device;
        if (!device)
            return;

        this.ignoreStatusUpdates = true;
        setTimeout(() => this.ignoreStatusUpdates = false, 500);

        clearInterval(this.timeInterval);

        Socket.emit(this.state.paused ? MessageType.UnpauseRequest : MessageType.PauseRequest, { host: device.host });
        this.setState({ paused: !this.state.paused });
    }

    private async onSeek(time: number) {
        const device = this.props.route?.params?.device;
        if (!device)
            return;

        Socket.emit(MessageType.SeekRequest, { host: device.host, time });
    }

    private async onSubtitlesToggled() {
        const device = this.props.route?.params?.device;
        if (!device)
            return;
        
        Socket.emit(MessageType.SubtitlesRequest, { host: device.host, enabled: !this.state.subtitles });
        this.setState({ subtitles: !this.state.subtitles });
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
    },

    subtitlesContainer: {
        height: 40,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },

    subtitlesButton: {
        flex: 1,
        backgroundColor: Colours.background.light,
        padding: 10,
        borderRadius: 5,
        height: 40,
        width: Dimensions.width() * 0.75
    },

    subtitlesButtonSelected: {
        backgroundColor: Colours.highlight.default
    },

    subtitlesText: {
        color: Colours.text.default,
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});