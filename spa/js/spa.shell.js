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
        '    </div>',
      chat_extend_time: 1000,
      chat_retract_time: 300,
      chat_extend_height: 450,
      chat_retract_height: 15
    },
    stateMap = {
      $container: null
    },
    jqueryMap = {},
    setJqueryMap, toggleChat, initModule;
  //End 声明所有变量

  //Begin Utility Methods 保留区块，不与页面元素交互
  //End Utility Methods 保留区块，不与页面元素交互

  //Begin 创建和操作DOM的函数
  //Begin DOM method /setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container,
      $chat: $container.find('.spa-shell-chat')
    };
  };
  //End DOM method /setJqueryMap/

  //begin DOM method /toggleChat/
  //功能： 展开或收起聊天滑块
  //判断：
  //  *do_extend -真则展开，伪则收起
  //  *callback  -避免出现竞争条件，同时在展开和收起，在动画结束时执行
  //参数：
  //  *chat_extend_time,chat_retract_time -时间调节展开收起速度
  //  *chat_extend_height,chat_retract_height -调节展开收起高度
  //返回值：布尔型
  //  *true -滑块动画激活
  //  *false -滑块动画不激活
  //
  toggleChat = function(do_extend, callback) {
    var
      px_chat_ht = jqueryMap.$chat.height(),
      is_open = px_chat_ht === configMap.chat_extend_height,
      is_closed = px_chat_ht === configMap.chat_retract_height,
      is_sliding = !is_open && !is_closed;

    //avoid race condition
    if (is_sliding) {
      return false;
    }

    //begin extend chat slider
    if (do_extend) {
      jqueryMap.$chat.animate({
          height: configMap.chat_extend_height
        }, configMap.chat_extend_time,
        function() {
          if (callback) {
            callback(jqueryMap.$chat);
          }
        });
      return true;
    }
    //end extend chat slider

    //begin retract chat slider
    jqueryMap.$chat.animate({
      height: configMap.chat_retract_height
    }, configMap.chat_retract_time, function() {
      if (callback) {
        callback(jqueryMap.$chat);
      }
    });
    return true;
    //end retract chat sider
  };
  //end DOM method /toggleChat/
  //end 创建和操作DOM的函数

  //begin Event Handles jquery事件处理函数
  //end Event Handles jquery事件处理函数

  //begin 公共方法
  //beigin public method /initModule/
  initModule = function($container) {
    //load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    //test toggle
    setTimeout(function() {
      toggleChat(true);
    }, 3000);
    setTimeout(function() {
      toggleChat(false);
    }, 8000);
  };
  //end public method /initModule/
  
  return {
    initModule: initModule
  };
  //end 公共方法
}());
