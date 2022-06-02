import { Button, ButtonProps, GestureResponderEvent, StyleSheet, Text, View } from 'react-native';

export type ProgressStatus = 'ready' | 'check' | 'next' | 'restart' | 'guess';

export type MapHeaderProps = {
  counter: string;
  targetFeature: any;
  distance: number;
  progressStatus: ProgressStatus;
  onStartPress: (event: GestureResponderEvent) => void;
  onCheckPress: (event: GestureResponderEvent) => void;
  onNextPress: (event: GestureResponderEvent) => void;
  onRestartPress: (event: GestureResponderEvent) => void;
};

export default function MapHeader({
  counter,
  distance,
  targetFeature,
  progressStatus,
  onStartPress,
  onCheckPress,
  onNextPress,
  onRestartPress
}: MapHeaderProps) {

  let buttonProps: ButtonProps = {
    title: '',
    color: '#841584'
  };

  console.log(progressStatus);

  switch (progressStatus) {
    case 'ready':
      buttonProps.onPress=onStartPress;
      buttonProps.title="Let's go";
      break;
    case 'check':
      buttonProps.onPress=onCheckPress;
      buttonProps.title="Check";
      break;
    case 'next':
      buttonProps.onPress=onNextPress;
      buttonProps.title="Next";
      break;
    case 'restart':
      buttonProps.onPress=onRestartPress;
      buttonProps.title="Restart";
      break;
    default:
      break;
  }

  return (
    <View style={styles.headerView}>
      {
        <Text>
          {counter}
        </Text>
      }
      <View style={styles.targetView}>
        <Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={styles.targetLabel}
        >
          {targetFeature ? targetFeature.properties.name : ''}
        </Text>
        { distance > 0 &&
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={styles.distance}
          >
            {`${targetFeature.properties.adm0name} – ${distance} km`}
          </Text>
        }
      </View>
      {
        progressStatus !== 'guess' &&
        <Button
          {...buttonProps}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  distance: {
    flex: 1,
    textAlign: 'center'
  },
  targetLabel: {
    color: '#333333',
    fontSize: 30,
    flex: 2,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  targetView: {
    flex: 1
  },
  headerView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderBottomWidth: 1
  }
});
