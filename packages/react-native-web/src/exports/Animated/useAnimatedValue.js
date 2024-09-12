import { useEffect, useRef } from 'react';
import Animated from '../../vendor/react-native/Animated/Animated';

const useAnimatedValue = (toValue, options = {}) => {
  const { method = 'timing', animationConfig = {}, interpolationConfig } = options;

  const animatedValue = useRef(new Animated.Value(toValue)).current;

  useEffect(() => {
    Animated[method](
      animatedValue,
      {
        toValue,
        ...animationConfig,
      }
    ).start();
  }, [toValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return interpolationConfig ? animatedValue.interpolate(interpolationConfig) : animatedValue;
};

export default useAnimatedValue;
