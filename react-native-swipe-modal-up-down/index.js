import React, { useState, useRef, useEffect } from "react";

import {
  Modal,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
  Easing,
  ImageBackground,
  Keyboard,
} from "react-native";

const { height } = Dimensions.get("window");

const SwipeUpDownModal = (props) => {
  const TIMING_CONFIG = {
    duration: props.duration ? props.duration : 450,
    easing: Easing.inOut(Easing.ease),
  };

  const pan = useRef(new Animated.ValueXY()).current;

  let [isAnimating, setIsAnimating] = useState(
    props.DisableHandAnimation ? true : false
  );

  let animatedValueX = 0;

  let animatedValueY = 0;

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (isAnimating) {
          return true;
        }
        if (gestureState.dy > 22) {
          return true;
        }
        return true;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: animatedValueX,
          y: animatedValueY,
        });
        pan.setValue({ x: 0, y: 0 }); // Initial value
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        // Flatten the offset so it resets the default positioning
            setIsAnimating(true);
            Animated.timing(pan, {
              toValue: { x: 0, y: -300 },
              ...TIMING_CONFIG,
              useNativeDriver: true,
            }).start(() => {
              setIsAnimating(false);
              props.onClose();
            });
      },
    })
  ).current;

  useEffect(() => {
    if (props.modalVisible) {
      animatedValueX = 0;
      animatedValueY = 0;
      pan.setOffset({
        x: animatedValueX,
        y: animatedValueY,
      });
      pan.setValue({
        x: 0,
        y: props.OpenModalDirection == "up" ? -300 : 300,
      }); // Initial value
      pan.x.addListener((value) => (animatedValueX = value.value));
      pan.y.addListener((value) => (animatedValueY = value.value));
    }
  }, [props.modalVisible]);

  useEffect(() => {
    if (props.PressToanimate) {
      setIsAnimating(true);
      Animated.timing(pan, {
        toValue: {
          x: 0,
          y: props.PressToanimateDirection == "up" ? -300 : 300,
        },
        ...TIMING_CONFIG,
        useNativeDriver: false,
      }).start(() => {
        setIsAnimating(false);
        props.onClose();
      });
    }
  }, [props.PressToanimate]);

  let handleGetStyleBody = (opacity) => {
    return [
      [
        styles.background,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          opacity: opacity,
        },
      ],
      [props.ContentModalStyle],
    ];
  };
  let handleMainBodyStyle = (opacity) => {
    return [
      [
        styles.ContainerModal,
        {
          opacity: opacity,
        },
      ],
      [props.MainContainerModal],
    ];
  };

  let interpolateBackgroundOpacity = pan.y.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [0, 1, 0],
  });

  return (
    <Modal
      transparent={true}
      visible={props.modalVisible}
      onShow={() => {
        setIsAnimating(true);
        Animated.timing(pan, {
          ...TIMING_CONFIG,
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start(() => {
          setIsAnimating(false);
        });
      }}
    >
      <Animated.View style={[handleMainBodyStyle(interpolateBackgroundOpacity),{maxHeight:200}]}>
        <Animated.View
          style={handleGetStyleBody(interpolateBackgroundOpacity)}
          {...panResponder.panHandlers}
        >
          <TouchableWithoutFeedback
            onPress={() => Keyboard.dismiss()}
            style={styles.TouchWithoutFeedBack}
          >
              {props.ContentModal}
          </TouchableWithoutFeedback>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    opacity: 1,
    flex: 1,
    marginTop: 55,
  },
  container: {
    marginTop: 50,
    position: "absolute",
    width: "100%",
  },
  ContainerModal: { backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1 },
  ImageBackground: {
    width: "100%",
    height: "100%",
  },
  TouchWithoutFeedBack: { flex: 1, },
});

export default SwipeUpDownModal;
