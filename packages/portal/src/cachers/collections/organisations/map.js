import baseData from '../index.js';

const PICK = ['id', 'lat', 'long'];

const data = async(context = {}) => {
  const entityData = await baseData({ qf: 'type:Organization' }, context);

  return entityData
    .filter((entity) => entity.hasAddress?.hasGeo)
    .map((entity) => {
      const [lat, long] = entity.hasAddress.hasGeo.replace('geo:', '').split(',');
      return {
        ...entity,
        lat,
        long
      };
    });
};

export {
  data,
  PICK
};
