import { Feature, FeatureCollection, MultiPolygon, Point } from 'geojson';
import capitals from './capitals.json';
import countries from './countries.json';
import { LatLng } from 'react-native-maps';
import booleanIntersects from '@turf/boolean-intersects';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function getSearchTargets(amount = 10): Feature<Point>[] {
  const targets: Feature<Point>[] = [];
  for (let index = 0; index < 10; index++) {
    const random = getRandomInt(200);
    targets.push((capitals as FeatureCollection<Point>).features[random])
  }
  return targets;
};

export async function getCountryFromCoords(latLng: LatLng, offline = false): Promise<Feature<MultiPolygon>> {
  if (offline) {
    const point = {
      "type": "Point",
      "coordinates": [ latLng.longitude, latLng.latitude ]
    };
    return (countries as any).features.find((country: any) => {
      return booleanIntersects(country, point);
    });
  } else {
    const params = {
      SERVICE: 'WFS',
      VERSION: '2.0.0',
      REQUEST: 'GetFeature',
      TYPENAMES: 'igrac:go_countryborders_faogaul2014',
      OUTPUTFORMAT: 'application/json',
      CQL_FILTER: `INTERSECTS(geometry, Point(${latLng.latitude} ${latLng.longitude}))`
    }
    const url = 'https://staging.igrac.kartoza.com/geoserver/ows?' + new URLSearchParams(params);
    try {
      const response = await fetch(url);
      const featureCollection = await response.json();
      if (featureCollection.features.length === 1) {
        return featureCollection.features[0];
      } else {
        return Promise.reject();
      }
    } catch (error) {
      return Promise.reject();
    }
  }
}
