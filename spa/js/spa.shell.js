//spa.shell.js
//Shell module for SPA

spa.shell = (function() {
  //Begin 声明所有变量
  var
    configMap = {
      main_html: String() + '<div class="spa-shell-head">' +
        '      <div class="spa-shell-head-logo"></div>' +
        '      <div class="spa-shell-dead-acct"></div>' +
        '      <div class="spa-shell-head-search"></div>' +
        '    </div>' +
        '    <div class="spa-shell-main">' +
        '      <div class="spa-shell-main-nav"></div>' +
        '      <div class="spa-shell-main-content"></div>' +
        '    </div>' +
        '    <div class="spa-shell-foot"></div>' +
        '    <div class="spa-shell-chat">' +
        '      <div class="spa-shell-modal"></div>' +
        '    </div>'
    },
    stateMap = {
      $container: null
    },
    jqueryMap = {},
    setJqueryMap, initModule;
  //End 声明所有变量

  //Begin Utility Methods 保留区块，不与页面元素交互
  //End Utility Methods 保留区块，不与页面元素交互

  //Begin 创建和操作DOM的函数
  //Begin DOM method /setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container
    };
  };
  //End DOM method /setJqueryMap/
  //end 创建和操作DOM的函数

  //begin Event Handles jquery事件处理函数
  //end Event Handles jquery事件处理函数

  //begin 公共方法
  //beigin public method /initModule/
  initModule = function($container) {
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();
  };
  //end public method /initModule/
  return {
    initModule: initModule
  };
  //end 公共方法
}());
