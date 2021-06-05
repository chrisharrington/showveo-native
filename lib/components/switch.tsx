import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Colours from '@lib/colours';


interface SwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    onLabel?: string;
    offLabel?: string;
}

export default class Switch extends React.Component<SwitchProps, {}> {
    render() {
        return <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.itemContainer}
                onPress={() => this.props.onChange(true)}
            >
                <Text
                    style={[styles.item, styles.first, this.props.enabled ? styles.selected : {}]}
                >
                    {this.props.onLabel || 'On'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.itemContainer}
                onPress={() => this.props.onChange(false)}
            >
                <Text
                    style={[styles.item, this.props.enabled ? {} : styles.selected]}
                >
                    {this.props.offLabel || 'Off'}
                </Text>
            </TouchableOpacity>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background.default,
        display: 'flex',
        height: 50,
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: 5
    },

    itemContainer: {
        flex: 1
    },

    item: {
        borderLeftWidth: 1,
        borderLeftColor: Colours.background.dark,
        color: Colours.text.default,
        textAlign: 'center',
        paddingTop: 15,
        height: 50
    },

    first: {
        borderLeftWidth: 0,
        borderRightWidth: 1
    },

    selected: {
        backgroundColor: Colours.highlight.default
    }
});