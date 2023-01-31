export default ({ Vue }) => {
  Vue.prototype.$ucwords = () => {
    let str = this.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function(s) {
      return s.toUpperCase();
    });
  };
};
