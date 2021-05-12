import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

import Colours from '../colours';


export class SelectItem {
    name: string;
    value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
}

interface SelectProps {
    items: SelectItem[];
    selected: string | undefined;
    onSelect: (value: string) => void;
    name?: string;
}

interface SelectState {
    index: number;
    visible: boolean;
}

export class Select extends React.Component<SelectProps, SelectState> {
    state = {
        index: 0,
        visible: false
    }

    render() {
        const selected = this.props.selected;
        return <View>
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.container}
                onPress={() => this.setState({ visible: true })}
            >
                {selected ?
                    <Text style={styles.selected}>{selected}</Text> :
                    <Text style={[styles.selected, styles.placeholder]}>{`Select a ${this.props.name || 'value'}...`}</Text>
                }
                <Ionicons style={styles.icon} name={'md-caret-down-outline'} color={Colours.text.lowlight} size={16} />
            </TouchableOpacity>

            <Modal
                isVisible={this.state.visible}
                backdropOpacity={0.4}
                hideModalContentWhileAnimating={true}
                backdropTransitionOutTiming={0}
                style={styles.picker}
                animationIn='fadeInUp'
                animationOut='fadeOutDown'
                animationInTiming={200}
                animationOutTiming={200}
            >
                <View style={styles.inner}>
                    <FlatList<SelectItem>
                        style={styles.container}
                        data={this.props.items}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                    />
                </View>
            </Modal>
        </View>;
    }

    private onOptionSelected(value: string) {
        this.setState({ visible: false });
        this.props.onSelect(value);
    }

    private renderItem = ({ item, index } : { item: SelectItem, index: number}) => (
        <TouchableOpacity
            style={[styles.item, index === 0 ? { borderTopWidth: 0 } : {}]}
            onPress={this.onOptionSelected.bind(this, item.value)}
        >
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.selector}></View>
        </TouchableOpacity>
    );

    private keyExtractor = (item: SelectItem) => item.name;
}

const styles = StyleSheet.create({
    container: {
        position: 'relative'
    },

    item: {
        borderColor: Colours.border.default,
        borderTopWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        padding: 15
    },

    itemText: {
        color: Colours.text.default
    },

    selector: {
        position: 'absolute',
        right: 15,
        borderRadius: 14,
        height: 14,
        width: 14,
        backgroundColor: Colours.highlight.default,
        top: 18,
        opacity: 0
    },

    selected: {
        fontSize: 16,
        color: Colours.text.default,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5,
        backgroundColor: Colours.background.default,
        paddingRight: 20
    },

    placeholder: {
        fontStyle: 'italic',
        color: Colours.text.lowlight
    },

    icon: {
        position: 'absolute',
        top: 19,
        right: 10,
        zIndex: 2,
        width: 20
    },

    picker: {
        justifyContent: 'flex-start',
        paddingTop: 50
    },

    inner: {
        backgroundColor: Colours.background.default,
        borderRadius: 5
    },
});