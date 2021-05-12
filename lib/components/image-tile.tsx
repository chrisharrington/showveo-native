import * as React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

interface IImageTileProps {
    image: string;
    width: number;
    style?: any;
}

export default class ImageTile extends React.Component<IImageTileProps, {}> {
    render() {
        return <View style={[styles.tile, this.props.style]}>
            <Image
                style={[styles.image, { width: this.props.width, height: this.props.width*9/16 }]}
                source={{
                    uri: this.props.image
                }}
            />

            <View style={styles.content}>
                {this.props.children}
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    tile: {
        position: 'relative',
        borderRadius: 5,
        backgroundColor: '#333333',
        overflow: 'hidden',
        shadowColor: 'red',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 7
    },

    image: {
        flex: 1,
        opacity: 0.8
    },

    content: {
        position: 'absolute',
        bottom: 0
    }
});