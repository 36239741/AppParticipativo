import Constants from 'expo-constants';

const ENV = {
    dev: {
      locationIQKey: 'pk.0ba47c736b49035de03b0604b9649f02'
    },
    staging: {

    },
    prod: {

    }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (env === null || env === undefined || env === "" || env.indexOf("dev") !== -1) return ENV.dev;
  if (env.indexOf("staging") !== -1) return ENV.staging;
  if (env.indexOf("prod") !== -1) return ENV.prod;
}

const selectedENV = getEnvVars();

export default selectedENV;