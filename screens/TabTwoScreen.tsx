import { Feature, Point } from 'geojson';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, MapEvent, Marker, Polyline, WMSTile } from 'react-native-maps';
import { getSearchTargets } from '../data/searchTargets';
import { getDistanceBetweenTwoPoints } from '../util/GeometrUtil';
import MapHeader, { ProgressStatus } from './MapHeader';

const { height, width } = Dimensions.get( 'window' );
const LATITUDE = 40.74333;
const LONGITUDE = -73.99033;
const LATITUDE_DELTA = 100;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

export default function TabTwoScreen() {

  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [markerCoords, setMarkerCoords] = useState<LatLng>();
  const [targetMarkerCoords, setTargetMarkerCoords] = useState<LatLng>();
  const [index, setIndex] = useState<number>(-1);
  const [searchTargets, setSearchTargets] = useState<Feature<Point>[]>([]);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);

  const onMapPress = (evt: MapEvent) => {
    if (index > -1) {
      setMarkerCoords(evt.nativeEvent.coordinate);
    }
  }

  const onNextPress = () => {
    setIndex(index + 1);
    setDistance(0);
    setMarkerCoords(undefined);
    setTargetMarkerCoords(undefined);
  };

  const onStartPress = () => {
    setDistance(0);
    setIndex(0);
    const newSearchTargets = getSearchTargets(10);
    setSearchTargets(newSearchTargets);
  };

  const onRestartPress = () => {
    setIndex(-1);
    setDistance(0);
    setTotalDistance(0);
    setMarkerCoords(undefined);
    setTargetMarkerCoords(undefined);
  };

  const onCheckPress = () => {
    const latLng: LatLng = {
      latitude: searchTargets[index].geometry.coordinates[1],
      longitude: searchTargets[index].geometry.coordinates[0]
    };

    const newDistance = getDistanceBetweenTwoPoints(markerCoords, latLng, true);
    setTargetMarkerCoords(latLng);
    if (newDistance) {
      setDistance(newDistance);
      setTotalDistance(Math.round((newDistance + totalDistance) * 100) / 100);
    }
  };

  const lastItem = index === searchTargets.length - 1;
  const inRange = index >= 0 && index < searchTargets.length - 1;
  const finished = lastItem && targetMarkerCoords;
  let progressStatus: ProgressStatus = 'ready';
  if (index < 0) {
    progressStatus = 'ready';
  } else if (inRange && targetMarkerCoords) {
    progressStatus = 'next'
  } else if (lastItem && targetMarkerCoords) {
    progressStatus = 'restart';
  } else if (markerCoords && !targetMarkerCoords) {
    progressStatus = 'check';
  } else {
    progressStatus = 'guess';
  }

  return (
    <View style={styles.container}>
      <MapHeader
        counter={`${index + 1}/${searchTargets.length}`}
        targetFeature={searchTargets[index]}
        distance={distance}
        onCheckPress={onCheckPress}
        onStartPress={onStartPress}
        onNextPress={onNextPress}
        onRestartPress={onRestartPress}
        progressStatus={progressStatus}
      />
        {
          finished && totalDistance > 0 &&
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={styles.results}
            >
              {`Total ${totalDistance} km`}
            </Text>
        }
        <MapView
          region={region}
          onRegionChangeComplete={(region) => setRegion(region)}
          style={styles.map}
          mapType="none"
          onPress={onMapPress}
          rotateEnabled={false}
        >
          <WMSTile
            urlTemplate="https://staging.igrac.kartoza.com/geoserver/ows?SERVICE=WMS&VERSION=1.3.0&request=GetMap&layers=igrac:go_countryborders_faogaul2014&format=image/png&transparent=true&styles=&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG:3857"
            zIndex={1}
            opacity={0.5}
            tileSize={512}
          />
          {
            markerCoords &&
            <Marker coordinate={markerCoords} pinColor="gold" />
          }
          {
            targetMarkerCoords &&
            <Marker coordinate={targetMarkerCoords} pinColor="green"/>
          }
          { markerCoords && targetMarkerCoords &&
            <Polyline
              coordinates={[
                markerCoords,
                targetMarkerCoords
              ]}
              strokeColor="#ff0000"
              strokeWidth={2}
            />
          }
        </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex'
  },
  results: {
    color: '#333333',
    fontSize: 30,
    flex: 1,
    textAlignVertical: 'center',
    backgroundColor: '#eeeeee'
  },
  map: {
    flex: 9
  }
});
