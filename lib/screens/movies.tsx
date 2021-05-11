import * as React from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Movie, MovieService } from 'showveo-lib';

import ImageTile from '../components/image-tile';

import BaseScreen from './base';

interface IMoviesScreenProps {
    navigation: any;
}

interface IMoviesScreenState {
    loading: boolean;
    movies: Movie[];
    tileWidth: number;
}

export default class MoviesScreen extends React.Component<IMoviesScreenProps, IMoviesScreenState> {
    state = {
        loading: true,
        movies: [],
        tileWidth: 0
    }

    async componentDidMount() {
        this.setState({
            loading: false,
            movies: await MovieService.getAll(0, 1000)
        });
    }

    render() {
        return <BaseScreen
            title='Movies'
            navigation={this.props.navigation}
        >
            <ScrollView
                style={styles.container}
                onLayout={(event: LayoutChangeEvent) => this.setState({ tileWidth: event.nativeEvent.layout.width })}
            >
                {this.state.movies.map((movie: Movie, index: number) => (
                    <MovieTile
                        index={index}
                        key={movie.name + movie.year}
                        movie={movie}
                        width={this.state.tileWidth}
                    />
                ))}
            </ScrollView>
        </BaseScreen>
    }
}

class MovieTile extends React.Component<{ movie: Movie, width: number, index: number }, {}> {
    render() {
        const movie = this.props.movie,
            index = this.props.index;

        return <ImageTile
            style={{ marginTop: index === 0 ? 0 : 30 }}
            image={movie.backdrop}
            width={this.props.width}
            onClick={() => {}}
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

// text-shadow: 1px 0px 2px rgba(0, 0, 0, 1);