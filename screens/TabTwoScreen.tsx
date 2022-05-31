import { useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { LatLng, MapEvent, Marker, Polyline, WMSTile } from 'react-native-maps';
import { getSearchTargets } from '../data/searchTargets';
import { getDistanceBetweenTwoPoints } from '../util/GeometrUtil';

const { height, width } = Dimensions.get( 'window' );
const LATITUDE = 40.74333;
const LONGITUDE = -73.99033;
const LATITUDE_DELTA = 100;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
const searchTargets = getSearchTargets();

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
  };

  const onRestartPress = () => {
    setIndex(-1);
    setDistance(0);
    setTotalDistance(0);
    setMarkerCoords(undefined);
    setTargetMarkerCoords(undefined);
  };

  const notStarted = index < 0;
  const lastItem = index === searchTargets.length - 1;
  const inRange = index >= 0 && index < searchTargets.length - 1;
  const finished = lastItem && targetMarkerCoords;

  const onCheck = () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        {
          <Text>
            {index + 1}/{searchTargets.length}
          </Text>
        }
        <View style={styles.targetView}>
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={styles.targetLabel}
          >
            {notStarted ? 'wo' : searchTargets[index].properties.name}
          </Text>
          { distance > 0 &&
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={styles.distance}
            >
              {`${searchTargets[index].properties.adm0name} – ${distance} km`}
            </Text>
          }
        </View>
          { notStarted &&
            <Button
              onPress={onStartPress}
              title="Lets go!"
              color="#841584"
            />
          }
          { inRange && targetMarkerCoords &&
            <Button
              onPress={onNextPress}
              title="Next!"
              color="#841584"
            />
          }
          { lastItem && targetMarkerCoords &&
            <Button
              onPress={onRestartPress}
              title="Restart!"
              color="#841584"
            />
          }
          { markerCoords && !targetMarkerCoords &&
            <Button
              onPress={onCheck}
              title="Check!"
              color="#ff22ee"
            />
          }
      </View>
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
  distance: {
    flex: 1,
    textAlign: 'center'
  },
  map: {
    flex: 9
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
