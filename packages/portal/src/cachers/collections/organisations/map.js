import baseData from '../index.js';

const PICK = ['id', 'geo'];

const data = async(context = {}) => {
  const entityData = await baseData({ qf: 'type:Organization' }, context);

  return entityData
    .filter((entity) => entity.hasAddress?.hasGeo)
    .map((entity) => {
      const [lat, long] = entity.hasAddress.hasGeo.replace('geo:', '').split(',').map(geoString => Number(geoString));
      const geo = [long, lat];

      return {
        ...entity,
        geo
      };
    });
};

export {
  data,
  PICK
};
