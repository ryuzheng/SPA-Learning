/*spa.shell.js
 *Shell module for SPA
 */

/*global $, spa */

spa.shell = (function() {
  //-----Begin 声明所有变量-----
  var
    configMap = {
      anchor_$chema_map: {
        chat: {
          opne: true,
          closed: true
        }
      },
      main_html: String() + '<div id="spa">' +
        '<div class="spa-shell-head">' +
        '<div class="spa-shell-head-logo"></div>' +
        '<div class="spa-shell-head-acct"></div>' +
        '<div class="spa-shell-head-search"></div>' +
        '</div>' +
        '<div class="spa-shell-main">' +
        '<div class="spa-shell-main-nav"></div>' +
        '<div class="spa-shell-main-content"></div>' +
        ' </div>' +
        '<div class="spa-shell-foot"></div>' +
        '<div class="spa-shell-chat"></div>' +
        '<div class="spa-shell-modal"></div>' +
        '</div>',
      chat_extend_time: 250,
      chat_retract_time: 300,
      chat_extend_height: 450,
      chat_retract_height: 15,
      chat_extended_title: 'Click to retract',
      chat_retracted_title: 'Click to extend'
    },
    stateMap = {
      $container: null,
      anchor_map: {},
      is_chat_retracted: true
    },
    jqueryMap = {},
    copyAnchorMap, setJqueryMap, toggleChat,
    changeAnchorPart, onHashchange,
    onClickChat, initModule;
  //-----End 声明所有变量-----

  //-----Begin Utility Methods 保留区块，不与页面元素交互-----
  //  Return copy of stored anchor map;minimizes overhead
  copyAnchorMap = function() {
    return $.extend(true, {}, stateMap.anchor_map);
  };
  //-----End Utility Methods 保留区块，不与页面元素交互-----

  //-----Begin 创建和操作 DOM 的函数-----
  //  Begin DOM method /setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container,
      $chat: $container.find('.spa-shell-chat')
    };
  };
  //  End DOM method /setJqueryMap/

  //  Begin DOM method /toggleChat/
  //  功能： 展开或收起聊天滑块
  //  实参：
  //    *do_extend -真则展开，伪则收起
  //    *callback  -避免出现竞争条件，同时在展开和收起，在动画结束时执行
  //  参数：
  //    *chat_extend_time,chat_retract_time -时间调节展开收起速度
  //    *chat_extend_height,chat_retract_height -调节展开收起高度
  //  返回值：布尔型
  //    *true -滑块动画激活
  //    *false -滑块动画不激活
  //  状态：  设置 stateMap.is_chat_retracted
  //    *true -滑块是收起状态
  //    *false -滑块是展开状态
  //
  toggleChat = function(do_extend, callback) {
    var
      px_chat_ht = jqueryMap.$chat.height(),
      is_open = px_chat_ht === configMap.chat_extend_height,
      is_closed = px_chat_ht === configMap.chat_retract_height,
      is_sliding = !is_open && !is_closed;

    //  Avoid race condition
    if (is_sliding) {
      return false;
    }

    //  Begin extend chat slider
    if (do_extend) {
      jqueryMap.$chat.animate({
          height: configMap.chat_extend_height
        }, configMap.chat_extend_time,
        function() {
          jqueryMap.$chat.attr(
            'title', configMap.chat_extended_title
          );
          stateMap.is_chat_retracted = false;
          if (callback) {
            callback(jqueryMap.$chat);
          }
        });
      return true;
    }
    //  End extend chat slider

    //  Begin retract chat slider
    jqueryMap.$chat.animate({
      height: configMap.chat_retract_height
    }, configMap.chat_retract_time, function() {
      jqueryMap.$chat.attr(
        'title', configMap.chat_retracted_title
      );
      stateMap.is_chat_retracted = true;
      if (callback) {
        callback(jqueryMap.$chat);
      }
    });
    return true;
    //  End retract chat sider
  };
  //  End DOM method /toggleChat/

  //  Begin DOm method /changeAnchorPart/
  //  功能： 对锚进行原子更新
  //  实参：
  //   *arg_map - URI 锚需要修改的那一部分的映射
  //  返回：
  //   *true - URI 锚部分已经修改
  //   *false - URI 锚部分不能被修改
  //  操作：
  //   存储在 stateMap.anchor_map 的当前锚代表
  //    查看想要更改的 uriAnchor
  //   This method
  //   * 使用 copyAnchorMap() 创建一份当前映射的拷贝
  //   * 使用 arg_map 修改键值
  //   * 管理在编码中的独立和依赖的值之间的区别
  //   * 试图用 uriAnchor 去修改 URI
  //   * 成功时返回 true, 失败时返回 flase
  //
  changeAnchorPart = function(arg_map) {
    var
      anchor_map_revise = copyAnchorMap(),
      bool_return = true,
      key_name, key_name_dep;

    // Begin merge change into anchor map
    KEYVAL:
      for (key_name in arg_map) {
        if (arg_map.hasOwnProperty(key_name)) {

          // Skip dependent keys during iteration
          if (key_name.indexOf('_') === 0) {
            continue KEYVAL;
          }

          //  Update independent key value
          anchor_map_revise[key_name] = arg_map[key_name];

          //  Update matching dependent key
          key_name_dep = '_' + key_name;
          if (arg_map[key_name_dep]) {
            anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
          }
        }
      }
      //  End merge changes into anchor map

    //  Begin attempt to update URI; revert if not successful
    try {
      $.uriAnchor.setAnchor(anchor_map_revise);
    } catch (error) {
      //  Replace URI with existing state
      $.uriAnchor.setAnchor(stateMap.anchor_map, null, true);
      bool_return = false;
    }
    //  End attempt to update URI

    return bool_return;
  };
  //  End DOM method /changeAnchorPart/
  //-----End 创建和操作 DOM 的函数-----

  //-----Begin Event Handles jquery 事件处理函数-----
  //  Begin event handler /onHashchange/
  //  Purpose: Handles the hashchange event
  //  Arguments:
  //   * event - jQuery event object
  //  Settings: none
  //  Returns: false
  //  Action:
  //   * Parses the URI anchor component
  //   * Compares proposed application state with current
  //   * Adjust the application only where proposed state differs from existing
  onHashchange = function(event) {
    var anchor_map_previous = copyAnchorMap(),
      anchor_map_proposed,
      _s_chat_previous, _s_chat_proposed,
      s_chat_proposed;

    //  Attempt to parse anchor
    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    } catch (error) {
      $.uriAnchor.setAnchor(anchor_map_previous, null, true);
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    //  Convenience vars
    _s_chat_previous = anchor_map_previous._s_chat;
    _s_chat_proposed = anchor_map_proposed._s_chat;

    //  Begin adjust chat component if changed
    if (!anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
      s_chat_proposed = anchor_map_proposed.chat;
      switch (s_chat_proposed) {
        case 'open':
          toggleChat(true);
          break;
        case 'closed':
          toggleChat(false);
          break;
        default:
          toggleChat(false);
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
      }
    }
    //  End adjust chat component if changed

    return false;
  };
  //  End Event handler /onHashchange/

  //  Begin Event handler /onClickChat/
  onClickChat = function(event) {
    changeAnchorPart({
      chat: (stateMap.is_chat_retracted ? 'open' : 'closed')
    });
    return false;
  };
  //  End Event handler /onClickChat/
  //-----End Event Handles jquery 事件处理函数-----

  //-----Begin 公共方法-----
  //  Beigin public method /initModule/
  initModule = function($container) {
    //  Load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    //  Initialize chat slider and bind click handler 设置stateMap.is_chat_retracted 的值和光标悬停文字，初始化事件处理程序
    stateMap.is_chat_retracted = true;
    jqueryMap.$chat
      .attr('title', configMap.chat_retracted_title)
      .click(onClickChat);

    //  Configure uriAnchor to use our schema
    $.uriAnchor.configModule({
      schema_map: configMap.anchor_schema_map
    });

    // configure and initialize feature modules
    spa.chat.configModule({});
    spa.chat.initModule(jqueryMap.$chat);

    //  Handle URI anchor change events.
    //  This is done /after/ all feature modules are configured and initialized, otherwise they will not be ready to handle the trigger event, which is used to ensure the anchor is considered on-load
    //
    $(window)
      .bind('hashchange', onHashchange)
      .trigger('hashchange');

    /**test toggle
    setTimeout(function() {
      toggleChat(true);
    }, 3000);
    setTimeout(function() {
      toggleChat(false);
    }, 8000);**/
  };
  //  End public method /initModule/

  return {
    initModule: initModule
  };
  //-----End 公共方法-----
}());
