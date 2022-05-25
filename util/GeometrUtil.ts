import { LatLng } from "react-native-maps";

export function getDistanceBetweenTwoPoints(cord1?: LatLng, cord2?: LatLng, round = false): number | undefined {
  if (!cord1 || !cord2) {
    return undefined;
  }

  if (cord1.latitude == cord2.latitude && cord1.longitude == cord2.longitude) {
    return 0;
  }

  const radlat1 = (Math.PI * cord1.latitude) / 180;
  const radlat2 = (Math.PI * cord2.latitude) / 180;

  const theta = cord1.longitude - cord2.longitude;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; //convert miles to km

  return Math.round(dist * 100) / 100;
}
