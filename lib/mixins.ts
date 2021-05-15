import Colours from './colours';

export default class Mixins {
    static textShadow = () => ({
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4
    });

    static boxShadow = () => ({
        
    });

    static label = () => ({
        fontSize: 14,
        color: Colours.text.default,
        fontFamily: 'Oswald',
        textTransform: 'uppercase',
        marginBottom: 10,
        ...Mixins.textShadow()
    } as any)
}