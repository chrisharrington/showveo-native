import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, TouchableHighlight } from 'react-native';
import { DrawerDescriptor, DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';

import Colours from '../colours';


interface NavigationRoute {
    key: string;
    name: string;
}

export default ({ navigation, routes } : { navigation: DrawerNavigationHelpers, routes: NavigationRoute[] }) : React.ReactNode => (
    <View style={styles.drawer}>
        <Text style={styles.drawerLabel}>Libraries</Text>
        {routes.map((route: NavigationRoute) => (
            <TouchableOpacity
                style={styles.drawerItemTouchable}
                key={route.key}
                onPress={() => {
                    navigation.navigate('movies');
                    navigation.closeDrawer();
                }}
                activeOpacity={0.5}
            >
                <Text style={styles.drawerItemText}>{route.name}</Text>
            </TouchableOpacity>
        ))}

    </View>
);

const styles = StyleSheet.create({
    drawer: {
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
    }
})