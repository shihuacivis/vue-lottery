/* ==========================================================
 * v20170627
 * ==========================================================
 * Copyright shihua
 *
 * 生活一直播抽奖页面
 * ========================================================== */

(function() {
  var pxUnit = 100; // 在px2rem中预设rem的值 即 1rem = ? px
  var designWid = 750; // 设计稿宽度
  var designHei = 1206; // 设计稿高度
  var desiginRatio = designWid / designHei;

  var $el = document.documentElement;
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

  var fAdapt = function() {

      var winWid = document.body.clientWidth;
      var winHei = document.body.clientHeight;
      var realRatio = winWid / winHei;
      var ratio = realRatio > desiginRatio ? (winHei / designHei) : (winWid / designWid);
      $el.style.fontSize = (ratio * pxUnit) + 'px';
  }

  window.addEventListener(resizeEvt, fAdapt, false);
  document.addEventListener('DOMContentLoaded', fAdapt, false);
})();
function animate (time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}
animate();
(function() {

  var vm = null;
  var ani = null;

  function fGetParams() {
    var url = window.location.search; // 获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
          var decodeParam = decodeURIComponent(strs[i]);
          var param = decodeParam.split("=");
          theRequest[param[0]] = param[1];
      }
    }
    return theRequest;
  }

  vm = new Vue({
    el: '#page-lottery',
    data: {
      aPickedList: [],
      sPhone: '*',
      aPhoneList: [],
      nRandNum: 0
    },
    filters: {
    },
    computed: {
    },
    mounted: function() {
      var self = this;
      var arr = [];
      this.nScreenWid = window.document.body.clientWidth;
      var oParams = fGetParams() || {};
      this.nPickNum = oParams.num || 5;
      // this.handleLotteryControl();
    },
    methods: {
      handleLotteryData: function(aData) {
        var self = this;
      },
      handleLotteryControl: function() {
        var self = this;
        var selectedNum = 1 + Math.floor(Math.random() * this.nPickNum);
        console.info('selectedNum', selectedNum);
        self.handleShowLotteryStart(selectedNum);
        setTimeout(function(){
          self.handleShowLotteryStop();
        }, 2000);
      },
      handleLotteryStop: function() {
        this.handleShowLotteryStop();
      },
      handleShowLotteryStart: function(sPhone) {
        var vm = this;

        var arr = [];

        var nRandNum = 200;
        for (var i = 0; i < nRandNum; i++) {
          var rphone = 1 + Math.floor(Math.random() * this.nPickNum);
          arr.push(rphone);
        }
        this.aPhoneList = arr;

        sPhone = sPhone || 1;
        this.aPhoneList.push(sPhone);

        // 真实的phone列表
        var nPhoneCount = this.aPhoneList.length;

        var runnningTime = 3000;

        var nAnimate = nPhoneCount - 1;
        // 比例动画
        console.info(TWEEN.Easing);
        ani = new TWEEN.Tween({ tweeningNumber: 0 })
          .to({ tweeningNumber: nAnimate }, runnningTime)
          .onUpdate(function () {
            var nCurIdx = this.tweeningNumber % nPhoneCount;
            var nRandIdx = Math.floor(nCurIdx);
            var sRandPhone = vm.aPhoneList[nRandIdx];
            vm.sPhone = sRandPhone;
          }).repeat(Infinity).start();
      },
      handleShowLotteryStop: function() {
        var vm = this;
        var runnningTime = 3000;
        ani.stop();
        var nPhoneCount = this.aPhoneList.length;
        var nStart = nPhoneCount - 12;
        var runnningTime = 1000;
        var nAnimate = nPhoneCount - 1;
        var sPhone = this.aPhoneList[nPhoneCount - 1];
        ani = new TWEEN.Tween({ tweeningNumber: nStart })
          .easing(TWEEN.Easing.Quadratic.Out)
          .to({ tweeningNumber: nAnimate }, runnningTime)
          .onUpdate(function () {
            var nCurNum = this.tweeningNumber;
            var nCurIdx = this.tweeningNumber % nPhoneCount;
            if (nCurNum == nAnimate) {
              vm.handleLotteryFinish(sPhone);
              return;
            }
            var nRandIdx = Math.floor(nCurIdx);
            var sRandPhone = vm.aPhoneList[nRandIdx];
            vm.sPhone = sRandPhone;
          }).start();
      },
      handleLotteryFinish: function(sPhone) {
        var vm = this;
      }
    }
  });
})();