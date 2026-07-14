import lodash from 'lodash';

const capitalizeLetters = (string = "") => {
  return lodash.startCase(string);
};

export default capitalizeLetters;
