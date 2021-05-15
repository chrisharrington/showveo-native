import * as React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface BaseScreenProps {
    title: string;
    navigation: any;
    back?: boolean;
}

export default class BaseScreen extends React.Component<BaseScreenProps, {}> {
    render() {
        const back = this.props.back,
            navigation = this.props.navigation;

        return <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => back ? navigation.goBack() : navigation.openDrawer()}>
                    <Ionicons name={back ? 'md-arrow-back-outline' : 'md-menu'} color='#ffffff' size={back ? 24 : 32} />
                </TouchableOpacity>
                <View style={styles.innerHeader}>
                    <Text style={styles.innerHeaderText}>{this.props.title}</Text>
                </View>
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
        height: 60,
        justifyContent: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },

    innerHeader: {
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
    }
});