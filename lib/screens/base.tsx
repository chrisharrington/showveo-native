import * as React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colours from '../colours';


interface BaseScreenProps {
    title: string;
    navigation: any;
    back?: boolean;
    loading?: boolean;
}

export default class BaseScreen extends React.Component<BaseScreenProps, {}> {
    render() {
        const { back, navigation, loading } = this.props;

        return <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => back ? navigation.goBack() : navigation.openDrawer()}>
                    <Ionicons name={back ? 'md-arrow-back-outline' : 'md-menu'} color='#ffffff' size={back ? 24 : 32} />
                </TouchableOpacity>
                <View style={styles.innerHeader}>
                    <Text style={styles.innerHeaderText}>{this.props.title}</Text>
                </View>
                {loading && <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        animating={loading}
                        color={Colours.highlight.default}
                        size={28}
                    />
                </View>}
            </View>
        
            <View style={styles.children}>
                {this.props.children}
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222'
    },

    header: {
        backgroundColor: '#333333',
        position: 'absolute',
        top: StatusBar.currentHeight,
        width: '100%',
        height: 60,
        flexDirection: 'row'
    },

    headerIcon: {
        width: 50,
        height: 60,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },

    innerHeader: {
        flex: 1,
        height: 60,
        justifyContent: 'center',
        marginLeft: 10
    },

    innerHeaderText: {
        color: '#ffffff',
        fontSize: 20
    },

    children: {
        flex: 1,
        marginTop: (StatusBar.currentHeight || 0) + 60
    },

    loadingContainer: {
        width: 28,
        justifyContent: 'center',
        paddingRight: 25
    }
});