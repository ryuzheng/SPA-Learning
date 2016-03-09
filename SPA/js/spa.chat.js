/*
 *spa.chat.js
 *Chat feature module for SPA
 */

spa.chat = (function() {
  //-----Begin module scope variables-----
  var
    configMap = {
      main_html: String() + '<div style="padiing:1em;color:#fff;">' + 'Say hello to chat' + '</div>',
      settable_map: {}
    },
    stateMap = {
      $container: null
    },
    jqueryMap = {},

    setJqueryMap, configModule, initModule;
  //-----End module scope variables-----

  //-----Begin utility methods-----
  //-----End utility methods-----

  //-----Begin DOM methods-----
  //  Begin DOM method /setJqueryMap/
  setJqueryMap = function() {
    var $container = stateMap.$container;
    jqueryMap = {
      $container: $container
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
})
