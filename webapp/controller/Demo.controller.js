sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("de.blogspot.openui5.youtube.controller.Demo", {

		onInit: function() {
			var oViewModel = new JSONModel({
				volume: 100,
				state: null,
				Videos: [{
					title: "Introduction to UI5 - Intro",
					publisher: "OpenUI5",
					published: "14.11.2014",
					videoId: "ray2yZ9BJ-c"
				}, {
					title: "Andreas Kunz explains OpenUI5",
					publisher: "O'Reilly",
					published: "27.04.2015",
					videoId: "vbcxQbwajTg"
				}, {
					title: "UI5con@SAP 2017",
					publisher: "OpenUI5",
					published: "12.07.2017",
					videoId: "mQkjAyoGfwI"
				}, {
					title: "SAP CodeTalk – What is UI5ers Buzz?",
					publisher: "SAP Community",
					published: "17.03.2017",
					videoId: "L-1pTbHTRO0"
				}]
			});
			this.getView().setModel(oViewModel, "ui");
			this._oViewModel = oViewModel;

			// set shortcut
			this._oYT = this.getView().byId("YTPlayer");

			// handle state change
			this._oYT.attachStateChange(this.onStateChange, this);
		},

		onStateChange: function(oEvent) {
			var sState = oEvent.getParameter("stateName");
			//iState = oEvent.getParameter("state");

			this._oViewModel.setProperty("/state", sState);
		},

		onUpdateFinished: function(oEvent) {
			var oList = oEvent.getSource(),
				oItems = oList.getItems();

			if (oItems.length > 0) {
				// first item
				var oItem = oItems[0];

				this._oYT.setVideoId(oItem.getBindingContext("ui").getProperty("videoId"));
			}
		},

		onSelect: function(oEvent) {
			var oItem = oEvent.getParameter("listItem"),
				oContext = oItem.getBindingContext("ui");

			this._oYT.setVideoId(oContext.getProperty("videoId"));
		},

		onToggleSound: function(oEvent) {
			var oButton = oEvent.getSource(),
				oPlayer = this._oYT.getPlayer();

			if (oPlayer.isMuted()) {
				oPlayer.unMute();
				oButton.setIcon("sap-icon://sound-loud");
			} else {
				oPlayer.mute();
				oButton.setIcon("sap-icon://sound-off");
			}
		},

		onPlay: function() {
			this._oYT.getPlayer().playVideo();

		},

		onPause: function() {
			this._oYT.getPlayer().pauseVideo();

		},

		onStop: function() {
			this._oYT.getPlayer().stopVideo();
		},

		onMute: function() {}

	});
});