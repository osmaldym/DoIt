import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react';
import { Animated, DimensionValue, ViewStyle } from 'react-native';

type SkeletonProps = PropsWithChildren<{
    width?: DimensionValue,
    height?: DimensionValue,
    animated?: boolean,
    borderRadius?: number,
    bgColor?: string,
    style?: ViewStyle,
}>

export function Skeleton(props: SkeletonProps): React.JSX.Element {
    const anim = useRef(new Animated.Value(0.5)).current;

    const startAnim = useCallback(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [anim]);

    useEffect(() => startAnim(), [startAnim]);

    const animStyle: ViewStyle = {
        opacity: anim,
        borderRadius: props.borderRadius ?? 25,
        backgroundColor: props.bgColor ?? '#999999',
        width: props.width ?? 'auto',
        height: props.height ?? 20,
    };

    return <Animated.View style={[animStyle, props.style]} /> ;
}
