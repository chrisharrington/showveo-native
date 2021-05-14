export default class Colours {
    static background = {
        default: '#333333',
        light: '#404040',
        dark: '#2a2a2a',
        error: '#bd1e18',
        success: '#35bd18'
    };

    static highlight = {
        default: '#46A2F1',
        dark: '#153754'
    };

    static text = {
        default: '#ffffff',
        inverse: '#000000',
        lowlight: '#aaaaaa',
        success: '#1edf24',
        error: '#FA4539'
    };

    static button = {
        negative: Colours.background.dark,
        positive: '#38A501'
    };

    static border = {
        default: Colours.background.light
    }
}