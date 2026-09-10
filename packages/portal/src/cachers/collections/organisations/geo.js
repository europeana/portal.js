import baseData from '../index.js';

const toGeoJsonFeature = ({ id, lat, long }) => {
  return {
    type: 'Feature',
    id,
    geometry: {
      type: 'Point',
      coordinates: [
        long,
        lat
      ]
    }
  };
};

const data = async(context = {}) => {
  const organisationsData = await baseData({ qf: 'type:Organization' }, context);
  const aggregatorsData = await baseData({ qf: 'type:Aggregator AND aggregatedVia:*' }, context);
  const entityData = organisationsData.concat(aggregatorsData);

  return {
    type: 'FeatureCollection',
    features: entityData
      .filter((entity) => entity.hasAddress?.hasGeo)
      .map((entity) => {
        const [lat, long] = entity.hasAddress.hasGeo
          .replace('geo:', '')
          .split(',')
          .map((geoString) => Number(geoString));

        return toGeoJsonFeature({ id: entity.id, lat, long });
      })
  };
};

export {
  data
};
