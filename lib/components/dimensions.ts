import { Dimensions as ReactDimensions, ScaledSize } from "react-native";

export default class Dimensions {
    private static dimensions: ScaledSize;

    static width() {
        if (!this.dimensions) this.init();
        return this.dimensions.width;
    }

    static height() {
        if (!this.dimensions) this.init();
        return this.dimensions.height;
    }

    private static init() {
        if (!this.dimensions)
            this.dimensions = ReactDimensions.get('window');
    }
}