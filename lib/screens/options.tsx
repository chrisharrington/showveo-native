import * as React from 'react';
import { Text } from 'react-native';

import { Media } from 'showveo-lib';

import BaseScreen from './base';

interface IOptionsScreenProps {
    navigation: any;
    media: Media;
}

export default class OptionsScreen extends React.Component<IOptionsScreenProps, {}> {
    render() {
        return <BaseScreen
            title='Options'
            navigation={this.props.navigation}
        >
            <Text>Options</Text>
        </BaseScreen>
    }
}