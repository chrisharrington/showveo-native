import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colours from '@lib/colours';;

interface ButtonProps {
    label: string;
    onPress: () => void;
    style?: any;
}

export default class Button extends React.Component<ButtonProps> {
    render() {
        return <TouchableOpacity
            style={[styles.button, this.props.style || {}]}
            onPress={this.props.onPress}
        >
            <Text style={styles.label}>{this.props.label}</Text>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 5,
        backgroundColor: Colours.highlight.default,
        paddingVertical: 8
    },

    label: {
        textTransform: 'uppercase',
        fontFamily: 'Oswald',
        fontSize: 20,
        color: Colours.text.default,
        textAlign: 'center'
    }
});