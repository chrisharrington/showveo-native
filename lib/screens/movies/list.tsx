import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'

import { Movie } from '@lib/models';
import ImageTile from '@lib/components/image-tile';
import BaseScreen from '@lib/screens/base';

interface MoviesListScreenProps {
    navigation: any;
    movies: Movie[];
    onClick: (movie: Movie) => void;
}

interface MoviesListScreenState {
    loading: boolean;
    tileWidth: number;
}

export default class MoviesListScreen extends React.Component<MoviesListScreenProps, MoviesListScreenState> {
    state = {
        loading: true,
        tileWidth: 0
    }

    async componentDidMount() {
        this.setState({
            loading: false,
            tileWidth: Dimensions.get('window').width
        });
    }

    render() {
        return <BaseScreen
            title='Movies'
            navigation={this.props.navigation}
        >
            <FlatList<Movie>
                style={styles.container}
                data={this.props.movies}
                initialNumToRender={5}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
            />
        </BaseScreen>
    }

    private renderItem = ({ item, index } : { item: Movie, index: number}) => (
        <TouchableOpacity
            key={item.name + item.year}
            activeOpacity={1}
            onPress={() => this.props.onClick(item)}
        >
            <MovieTile
                index={index}
                movie={item}
                width={this.state.tileWidth}
            />
        </TouchableOpacity>
    );

    private keyExtractor = (movie: Movie) => (
        movie.name + movie.year
    )
}

class MovieTile extends React.Component<{ movie: Movie, width: number, index: number }, {}> {
    render() {
        const movie = this.props.movie,
            index = this.props.index;

        return <ImageTile
            style={{ marginTop: index === 0 ? 0 : 30 }}
            image={movie.backdrop}
            width={this.props.width}
        >
            <View style={styles.contents}>
                <Text style={styles.name}>{movie.name}</Text>
            </View>
        </ImageTile>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },

    contents: {
        paddingHorizontal: 15,
        paddingVertical: 10
    },

    name: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'Oswald',
        textTransform: 'uppercase',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4
    }
});