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
          opened: true,
          closed: true
        }
      },
      resize_interval: 200,
      main_html: String() +
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
        '<div class="spa-shell-modal"></div>'
    },
    stateMap = {
      $container: undefined,
      anchor_map: {},
      resize_idto: undefined
    },
    jqueryMap = {},
    copyAnchorMap, setJqueryMap, changeAnchorPart, onHashchange, onResize, setChatAnchor, initModule;
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
      $container: $container
    };
  };
  //  End DOM method /setJqueryMap/

  //  Begin DOM method /changeAnchorPart/
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
          } else {
            delete anchor_map_revise[key_name_dep];
            delete anchor_map_revise['_s' + key_name_dep];
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

  //-----Begin Event Handlers  jquery事件处理函数-----
  // Begin Event handler /onResize/
  onResize = function() {
    if (stateMap.resize_idto) {
      return true;
    }

    spa.chat.handleResize();
    stateMap.resize_idto = setTimeout(function() {
      stateMap.resize_idto = undefined;
    }, configMap.resize_interval);
    return true;
  };
  // End Event handler /onResize/

  //  Begin event handler /onHashchange/
  //  Purpose: Handles the hashchange event
  //  Arguments:
  //   * event - jQuery event object
  //  Settings: none
  //  Returns: false
  //  Action:
  //   * Parses the URI anchor component
  //   * Compares proposed application state with current
  //   * Adjust the application only where proposed state differs from existing and is allowed by anchor schema
  onHashchange = function(event) {
    var
      _s_chat_previous, _s_chat_proposed, s_chat_proposed,
      anchor_map_proposed,
      is_ok = true,
      anchor_map_previous = copyAnchorMap();

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
        case 'opened':
          is_ok = spa.chat.setSliderPosition('opened');
          break;
        case 'closed':
          is_ok = spa.chat.setSliderPosition('closed');
          break;
        default:
          spa.chat.setSliderPosition('closed');
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
      }
    }
    //  End adjust chat component if changed

    //  Beigin revert anchor if slider change denied
    if (!is_ok) {
      if (anchor_map_previous) {
        $.uriAnchor.setAnchor(anchor_map_previous, null, true);
        stateMap.anchor_map = anchor_map_previous;
      } else {
        delete anchor_map_proposed.chat;
        $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
      }
    }
    //  End revert anchor if slider change denied

    return false;
  };
  //  End Event handler /onHashchange/
  //-----End Event Handles  jquery 事件处理函数-----

  //-----Begin callback-----
  //  Begin callback method /setChatAnchor/
  //  Example  : setChatAnchor( 'closed' );
  //  Purpose  : Change the chat component of the anchor
  //  Arguments:
  //    * position_type - may be 'closed' or 'opened'
  //  Action   :
  //    Changes the URI anchor parameter 'chat' to the requested
  //    value if possible.
  //  Returns  :
  //    * true  - requested anchor part was updated
  //    * false - requested anchor part was not updated
  //  Throws   : none
  //
  setChatAnchor = function(position_type) {
    return changeAnchorPart({
      chat: position_type
    });
  };
  //  End callback method /setChatAnchor/
  //-----End callback-----

  //-----Begin 公共方法-----
  //  Beigin public method /initModule/
  // Example  : spa.shell.initModule( $('#app_div_id') );
  // Purpose  :
  //   Directs the Shell to offer its capability to the user
  // Arguments :
  //   * $container (example: $('#app_div_id')).
  //     A jQuery collection that should represent
  //     a single DOM container
  // Action    :
  //   Populates $container with the shell of the UI
  //   and then configures and initializes feature modules.
  //   The Shell is also responsible for browser-wide issues
  //   such as URI anchor and cookie management.
  // Returns   : none
  // Throws    : none
  //
  initModule = function($container) {
    //  Load HTML and map jQuery collections
    stateMap.$container = $container;
    $container.html(configMap.main_html);
    setJqueryMap();

    //  Configure uriAnchor to use our schema
    $.uriAnchor.configModule({
      schema_map: configMap.anchor_schema_map
    });

    // configure and initialize feature modules
    spa.chat.configModule({
      set_chat_anchor: setChatAnchor,
      chat_model: spa.model.chat,
      people_model: spa.model.people
    });
    spa.chat.initModule(jqueryMap.$container);

    //  Handle URI anchor change events.
    //  This is done /after/ all feature modules are configured and initialized, otherwise they will not be ready to handle the trigger event, which is used to ensure the anchor is considered on-load
    //
    $(window)
      .bind('resize', onResize)
      .bind('hashchange', onHashchange)
      .trigger('hashchange');
  };
  //  End public method /initModule/

  return {
    initModule: initModule
  };
  //-----End 公共方法-----
}());
