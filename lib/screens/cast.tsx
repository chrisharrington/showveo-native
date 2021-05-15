import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Media } from 'showveo-lib';

import { Select, SelectItem } from '../components/select';
import Button from '../components/button';

import BaseScreen from './base';
import Mixins from '../mixins';


interface OptionsScreenProps {
    navigation: any;
    media: Media;
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
                        onPress={() => this.props.navigation.navigate('cast', { media })}
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
        ...Mixins.label()
    },

    buttons: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 15,
    }
});