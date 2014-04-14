/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";

var main = function(
    GameClient,
    AudioManager,
    Cookies,
    ExampleUI,
    Input,
    Misc,
    MobileHacks) {
  var g_client;
  var g_audioManager;
  var g_clock;
  var g_grid;
  var g_instrument;
  var g_left = false;
  var g_right = false;
  var g_jump = false;

  var globals = {
    debug: false,
  };
  Misc.applyUrlSettings(globals);
  MobileHacks.fixHeightHack();

  function $(id) {
    return document.getElementById(id);
  }

  g_client = new GameClient({
    gameId: "jumpjump",
  });

  function handleScore() {
  };

  function handleDeath() {
  };

  g_client.addEventListener('score', handleScore);
  g_client.addEventListener('die', handleDeath);

  var color = Misc.randCSSColor();
  g_client.sendCmd('setColor', { color: color });
  document.body.style.backgroundColor = color;

  var sounds = {};
  g_audioManager = new AudioManager(sounds);

  ExampleUI.setupStandardControllerUI(g_client, globals);

  function handleKeyDown(keyCode, state) {
    switch(keyCode) {
    case 37: // left
      if (!g_left) {
        g_left = true;
        g_client.sendCmd('move', {
            dir: -1
        });
      }
      break;
    case 39: // right
      if (!g_right) {
        g_right = true;
        g_client.sendCmd('move', {
            dir: 1
        });
      }
      break;
    case 90: // z
      if (!g_jump) {
        g_jump = true;
        g_client.sendCmd('jump', {
            jump: 1
        });
      }
      break;
    }
  }

  function handleKeyUp(keyCode, state) {
    switch(keyCode) {
    case 37: // left
      g_left = false;
      g_client.sendCmd('move', {
          dir: (g_right) ? 1 : 0
      });
      break;
    case 39: // right
      g_right = false;
      g_client.sendCmd('move', {
          dir: (g_left) ? -1 : 0
      });
      break;
    case 90: // z
      g_jump = false;
      g_client.sendCmd('jump', {
          jump: 0
      });
      break;
    }
  }

  Input.setupControllerKeys(handleKeyDown, handleKeyUp);
};

// Start the main app logic.
requirejs(
  [ '../../../scripts/gameclient',
    '../../scripts/audio',
    '../../scripts/cookies',
    '../../scripts/exampleui',
    '../../scripts/input',
    '../../scripts/misc',
    '../../scripts/mobilehacks',
  ],
  main
);
