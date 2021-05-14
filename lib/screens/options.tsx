import * as React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';

import { Device, Media } from 'showveo-lib';

import { Select, SelectItem } from '../components/select';
import Button from '../components/button';
import Colours from '../colours';

import BaseScreen from './base';
import Mixins from '../mixins';


interface OptionsScreenProps {
    navigation: any;
    media: Media;
    devices: Device[];
    onDeviceSelected: (device: Device) => void;

    selectedDevice: Device | null;
}

interface OptionsScreenState {
    subtitles: boolean;
    resume: boolean;
}

export default class OptionsScreen extends React.Component<OptionsScreenProps, OptionsScreenState> {
    state = {
        subtitles: false,
        resume: true
    }

    render() {
        const media = this.props.media;
        return <BaseScreen
            title={media.name}
            navigation={this.props.navigation}
            back={true}
        >
            <View style={styles.container}>
                <View style={styles.option}>
                    <Text style={styles.label}>Device</Text>
                    <Select
                        items={this.props.devices.map((device: Device) => (new SelectItem(device.name, device.id)))}
                        selected={this.props.selectedDevice?.name}
                        onSelect={(value: string) => this.props.onDeviceSelected(this.props.devices.find((device: Device) => device.id === value) as Device)}
                    />
                </View>

                <View style={styles.option}>
                    <Text style={styles.label}>Subtitles</Text>
                    <Select
                        items={['None', 'English'].map((subtitle: string) => (new SelectItem(subtitle, subtitle)))}
                        selected={this.state.subtitles ? 'English' : 'None'}
                        onSelect={(subtitle: string) => this.setState({ subtitles: subtitle === 'English' })}
                    />
                </View>

                <View style={styles.buttons}>
                    <Button
                        label='Play'
                        onPress={() => {}}
                    />
                </View>
            </View>
        </BaseScreen>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },

    option: {
        marginBottom: 25
    },

    label: {
        fontSize: 14,
        color: Colours.text.default,
        fontFamily: 'Oswald',
        textTransform: 'uppercase',
        marginBottom: 10,
        ...Mixins.textShadow()
    },

    buttons: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 15,
    }
});