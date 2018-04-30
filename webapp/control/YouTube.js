/*global YT,window*/
/*!
 * OpenUI5 Developer control YouTube (Player)
 * (c) Copyright 2018 by Holger Schäfer
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 * 
 * see https://developers.google.com/youtube/iframe_api_reference
 */

// Provides control de.blogspot.openui5.youtube.control.YouTube.
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Control"
], function(jQuery, Control) {
	"use strict";
	var YouTube = Control.extend("de.blogspot.openui5.youtube.control.YouTube", {

		metadata: {
			properties: {
				/**
				 * Width of the control
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Appearance",
					defaultValue: "inherit"
				},

				/**
				 * Height of the control
				 */
				height: {
					type: "sap.ui.core.CSSSize",
					group: "Appearance",
					defaultValue: "inherit"
				},

				/**
				 * video id
				 */
				videoId: {
					type: "string",
					group: "Data",
					defaultValue: null
				},

				/**
				 * volume
				 */
				volume: {
					type: "int",
					group: "Data",
					defaultValue: 100
				},

				/**
				 * instantly start playing video
				 */
				autoplay: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * show media bar to control video element
				 */
				controls: {
					type: "boolean",
					group: "Appearance",
					defaultValue: false
				},

				/**
				 * loop video at the end and start again
				 */
				loop: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				},

				/**
				 * mute volume
				 */
				muted: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				}
			},
			events: {
				/**
				 * Fires when selection is changed via user interaction inside the control.
				 * @since 1.16
				 */
				stateChange: {
					parameters: {
						/**
						 * Indicates whether the <code>listItem</code> parameter is selected or not.
						 */
						muted: {
							type: "boolean"
						},

						/**
						 * Indicates whether the select all action is triggered or not.
						 */
						state: {
							type: "integer"
						},

						/**
						 * Indicates whether the select all action is triggered or not.
						 */
						stateName: {
							type: "string"
						}
					}
				}
			}
		},

		/**
		 * Control lifecycle method initializes the google youtube api
		 * @param rm
		 * @param oControl
		 */
		init: function() {
			if (Control.prototype.init) { // check whether superclass implements the method
				Control.prototype.init.apply(this, arguments); // call the method with the original arguments
			}

			this.oPlayer = null;

			if (!this.oPlayer) {
				window.onYouTubeIframeAPIReady = function() {
					this.oPlayer = new YT.Player(this.getId("ytplayer"), {
						height: this.getHeight(),
						width: this.getWidth(),
						videoId: this.getVideoId(),
						playerVars: {
							autoplay: 1,
							controls: 1,
							loop: 1
						},
						events: {
							"onReady": this.onReady.bind(this),
							"onStateChange": this.onStateChange.bind(this),
							"onPlaybackQualityChange": this.onPlaybackQualityChange.bind(this),
							"onError": this.onError.bind(this)
						}
					})
				}.bind(this);
			}

			// load the youtube api script
			jQuery.sap.includeScript("https://www.youtube.com/iframe_api", "yt_iframe_api");
		},

		/**
		 * Control lifecycle method that is fired when the control needs to be rendered
		 * @param rm
		 * @param oControl
		 */
		renderer: function(oRm, oControl) {
			// write placeholder tag (will be replaced by iframe)
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("youtube");
			oRm.writeClasses();
			oRm.write(">");

			// write inner player container replaced by iframe
			oRm.write('<div id="' + oControl.getId("ytplayer") + '"></div>');

			// close tag
			oRm.write("</div>");
		},

		onReady: function(event) {
			var oPlayer = event.target;

			oPlayer.setVolume(this.getVolume());
		},

		onError: function(event) {
			jQuery.sap.log.error("youtube player error!", event);
		},

		onStateChange: function(event) {
			var iState = event.data,
				sState;

			switch (iState) {
				case YT.PlayerState.UNSTARTED:
					sState = "UNSTARTED";
					break;
				case YT.PlayerState.ENDED:
					sState = "ENDED";
					break;
				case YT.PlayerState.PLAYING:
					sState = "PLAYING";
					break;
				case YT.PlayerState.PAUSED:
					sState = "PAUSED";
					break;
				case YT.PlayerState.BUFFERING:
					sState = "BUFFERING";
					break;
				case YT.PlayerState.CUED:
					sState = "CUED";
					break;
			}

			this.fireStateChange({
				state: iState,
				stateName: sState
			});
		},

		onPlaybackQualityChange: function(event) {
			jQuery.sap.log.debug("onPlaybackQualityChange", event);
		},

		getId: function(sSuffix) {
			var sId = this.sId;
			return sSuffix ? sId + "-" + sSuffix : sId;
		},

		getPlayer: function() {
			return this.oPlayer;
		},

		setVideoId: function(sVideoId) {
			if (sVideoId === this.getVideoId()) {
				return this;
			}

			this.setProperty("videoId", sVideoId, true);

			if (this.oPlayer) {
				this.oPlayer.loadVideoById(sVideoId);
			}

			return this;
		},

		setVolume: function(iVolume) {
			if (iVolume === this.getVolume()) {
				return this;
			}

			if (iVolume < 0) {
				iVolume = 0;
			}
			if (iVolume > 100) {
				iVolume = 100;
			}

			this.setProperty("volume", iVolume, true);

			if (this.oPlayer) {
				this.oPlayer.setVolume(iVolume);
			}

			return this;
		}

	});

	return YouTube;

});