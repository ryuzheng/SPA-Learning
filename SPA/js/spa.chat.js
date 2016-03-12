/*
 *spa.chat.js
 *Chat feature module for SPA
 */

/* global $, spa, getComputedStyle */
spa.chat = (function() {
  //-----Begin module scope variables-----
  var
    configMap = {
      main_html: String()
      + '<div class="spa-chat">'
      + '<div class="spa-chat-head">'
      + '<div class="spa-chat-head-toggle">'
      + '<div class="spa-chat-head-title">'
      +   'Chat'
      + '</div>'
      + '</div>'
      + '<div class="spa-chat-closer">x</div>'
      + '<div class="spa-chat-sizer">'
      + '<div class="spa-chat-msgs"></div>'
      + '<div class="spa-chat-box">'
      + '<input type="text" />'
      + '<div>send</div>'
      + '</div>'
      + '</div>'
      + '</div>',
      settable_map: {
        slider_open_time:true,
        slider_close_time:true,
        slider_opened_em:true,
        slider_closed_em:true,
        slider_opened_title:true,
        slider_closed_title:true,

        chat_model:true,
        people_model:true,
        set_chat_anchor:true
      },
      slider_open_time:250,
      slider_close_time:250,
      slider_opened_em:16,
      slider_closed_em:2,
      slider_opened_title:'Click to close',
      slider_closed_title:'Click to open',

      chat_model:null,
      people_model:null,
      set_chat_anchor:null
    },
    stateMap = {
      $append_target: null,
      position_type:'closed',
      px_per_em:0,
      slider_hidden_px:0,
      slider_closed_px:0,
      slider_opened_px:0
    },
    jqueryMap = {},

    setJqueryMap, getEmSize, setPxSizes, setSliderPosition, onClickToggle, configModule, initModule;
  //-----End module scope variables-----

  //-----Begin utility methods-----
  getEmSize=function(elem){
    return Number(
      getComputedStyle(elem,'').fontSize.math(/\d*\.?\d*/)[0]);
  };
  //-----End utility methods-----

  //-----Begin DOM methods-----
  //  Begin DOM method /setJqueryMap/
  setJqueryMap = function() {
    var
      $append_target = stateMap.$append_target,
      $slider=$append_target.find('.spa-chat');
    jqueryMap = {
      $slider: $slider,
      $head:$slider.find('.spa-chat-head'),
      $toggle:$slider.find('.spa-chat-head-toggle'),
      $title:$slider.find('.spa-chat-head-title'),
      $sizer:$slider.find('.spa-chat-sizer'),
      $msgs:$slider.find('.spa-chat-msgs'),
      $box:$slider.find('.spa-chat-box'),
      $input:$slider.find('.spa-chat-input input[type=text]')
    };
  };
  //  End DOM method /setJqueryMap/
  //-----End DOM methods-----

  //-----Begin event handlers-----
  //-----End event handlers-----

  //-----Begin public methods-----
  //  Begin public method /configModule/
  //  Purpose: Adjust configuration of allowed keys
  //  Arguments: A map of settable keys and values
  //    * color_name -color to use
  //  Setting:
  //    * configMap.settable_map declares allowed keys
  //  Returns: true
  //  Throws: none
  //
  configModule = function(input_map) {
    spa.util.setConfigMap({
      input_map: input_map,
      settable_map: configMap.settable_map,
      config_map: configMap
    });
    return true;
  };
  //  End public method /configModule/

  //  Begin public method /initModule/
  //  Purpose: Initializes module
  //  Arguments:
  //    * $container the jquery element used by this feature
  //  Returns: true
  //  Throws: none
  //
  initModule = function($container) {
    $container.html(configMap.main_html);
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  };
  //  End public method /initModule/

  // return public methods
  return {
    configModule: configModule,
    initModule: initModule
  };
  //-----End public methods-----
}());