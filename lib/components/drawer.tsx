import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

import { Device } from '@lib/models';
import Colours from '@lib/colours';;
import { Navigation, Screen } from '@lib/models';


interface NavigationRoute {
    key: string;
    name: string;
}

interface DrawerContentsProps {
    routes: NavigationRoute[];
    navigation: Navigation;
    activeDevices: Device[];
}

export default class DrawerContents extends React.Component<DrawerContentsProps> {
    render() {
        const { routes, navigation, activeDevices } = this.props;
        return <View style={styles.drawer}>
            <Text style={styles.drawerLabel}>Libraries</Text>
            {routes.map((route: NavigationRoute) => (
                <TouchableOpacity
                    style={styles.touchable}
                    key={route.key}
                    onPress={() => {
                        navigation.navigate(Screen.Movies);
                        navigation.closeDrawer();
                    }}
                    activeOpacity={0.5}
                >
                    <Text style={styles.label}>{route.name}</Text>
                </TouchableOpacity>
            ))}

            <Text style={[styles.drawerLabel, styles.bigSpacing]}>Active Devices</Text>
            {activeDevices.map((device: Device) => (
                <TouchableOpacity
                    style={styles.touchable}
                    activeOpacity={0.5}
                    onPress={() => {}}
                    key={device.id}
                >
                    <Text style={styles.label}>{device.name}</Text>
                    {/* {device.media && <Text style={styles.sublabel}>{device.media}</Text>} */}
                </TouchableOpacity>
            ))}
        </View>;
    }
}

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        backgroundColor: Colours.background.default,
        paddingTop: (StatusBar.currentHeight || 0) + 25
    },

    drawerLabel: {
        fontFamily: 'Oswald',
        fontSize: 12,
        textTransform: 'uppercase',
        color: Colours.highlight.default,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        marginBottom: 5
    },

    drawerItemTouchable: {
        padding: 15
    },

    drawerItemText: {
        color: Colours.text.default,
        fontSize: 18
    },

    bigSpacing: {
        marginTop: 30
    },

    touchable: {
        borderRadius: 5,
        padding: 12,
        backgroundColor: Colours.background.light,
        marginTop: 10,
        marginHorizontal: 15
    },

    label: {
        color: Colours.text.default,
        fontSize: 15
    },

    sublabel: {
        color: Colours.text.lowlight,
        fontSize: 12,
        marginTop: 3
    }
})