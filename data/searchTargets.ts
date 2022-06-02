import { Feature, FeatureCollection, Point } from 'geojson';
import capitals from './capitals.json';

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
