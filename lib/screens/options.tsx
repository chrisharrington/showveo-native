import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Device, Media } from 'showveo-lib';

import { Select, SelectItem } from '../components/select';
import Switch from '../components/switch';
import Colours from '../colours';

import BaseScreen from './base';


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
        return <BaseScreen
            title={this.props.media.name}
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
                    <Switch
                        enabled={this.state.subtitles}
                        onChange={(subtitles: boolean) => this.setState({ subtitles })}
                        onLabel='English'
                        offLabel='None'
                    />
                </View>

                <View style={styles.option}>
                    <Text style={styles.label}>Start Time</Text>
                    <Switch
                        enabled={this.state.resume}
                        onChange={(resume: boolean) => this.setState({ resume })}
                        onLabel='Play from 1:23:45'
                        offLabel='Play from beginning'
                    />
                </View>
            </View>
        </BaseScreen>
    }
}

const styles = StyleSheet.create({
    container: {
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
        marginBottom: 10
    }
});