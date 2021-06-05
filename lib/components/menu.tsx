import * as React from 'react';
import { View, StyleSheet, Animated, Easing, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import Colours from '@lib/colours';
import Dimensions from './dimensions';


interface MenuProps<TModel> {
    renderItem: ({ item, index } : { item: TModel, index: number }) => JSX.Element,
    keyExtractor: (item: TModel) => string;
    data: TModel[];
}

interface MenuState {
    position: Animated.Value;
    opacity: Animated.Value;
    height: number;
    visible: boolean;
}

export default class Menu<TModel> extends React.Component<MenuProps<TModel>, MenuState> {
    private onBackHandler: any;

    state = {
        position: new Animated.Value(0),
        opacity: new Animated.Value(0),
        height: 0,
        visible: false
    }

    componentDidMount() {
        this.onBackHandler = this.onBack.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
    }

    show() {
        this.setState({ visible: true });
        this.timing(this.state.position, this.state.height * -1).start();
        this.timing(this.state.opacity, 0.5).start();
    }

    hide() {
        this.setState({ visible: false });
        this.timing(this.state.position, 0).start();
        this.timing(this.state.opacity, 0).start();
    }

    render() {
        return <View style={styles.container}>
            <Animated.View
                style={[
                    styles.menu,
                    { transform: [{ translateY: this.state.position }] }
                ]}
                onLayout={event => this.setState({ height: event.nativeEvent.layout.height })}
            >
                <FlatList<TModel>
                    renderItem={this.props.renderItem}
                    keyExtractor={this.props.keyExtractor}
                    data={this.props.data}
                />
            </Animated.View>

            <Animated.View
                style={[styles.overlay, { opacity: this.state.opacity }]}
                pointerEvents='none'
            />
        </View>
    }

    private timing = (value: Animated.Value, to: number) => (
        Animated.timing(value, {
            toValue: to,
            duration: 250,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease)
        })
    );

    private onBack() {
        if (this.state.visible) {
            this.hide();
            return true;
        }

        return false;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0
    },
    
    menu: {
        position: 'absolute',
        zIndex: 3,
        elevation: 3,
        top: Dimensions.height(),
        width: Dimensions.width(),
        backgroundColor: Colours.background.default,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },

    overlay: {
        position: 'absolute',
        zIndex: 2,
        elevation: 2,
        width: Dimensions.width(),
        height: Dimensions.height(),
        backgroundColor: 'black'
    }
})