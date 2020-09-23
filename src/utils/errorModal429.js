import ErrorModal429  from '../views/common/429'
export default {
  install(Vue) {
    function confirm(data = {}) {
      const {  modalShow } = data;
      const ConfirmConstructor = Vue.extend(ErrorModal429);
      const instance = new ConfirmConstructor({
        el: document.createElement("div"),
        propsData: {
          modalShow,
        },
      });

      document.querySelector("body").innerHTML = ''
      document.querySelector("body").appendChild(instance.$el);
    }

    Vue.prototype.$errorModal429 = confirm;

    return confirm;
  },


};