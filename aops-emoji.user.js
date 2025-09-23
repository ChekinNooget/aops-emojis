// ==UserScript==
// @name         AoPS Emojis
// @namespace    https://github.com/ChekinNooget/
// @version      1.0
// @description  Adds ability to have custom emojis in AoPS
// @author       ChekinNooget
// @match        https://artofproblemsolving.com/community/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	var emojiList = [
		[":blobheart:", "/1/f/9d9d9a051c3c5b47d922c8f5591b97f8f20e0b.png"],
		[":wiltedRose:", "/d/8/8d36f5017b76884c75206a49add6e94170a29b.png"],
		[":thonk:", "/f/8/7e06cd6e4677112ab8073117c757989e7ab6da.png"],
		[":33:", "/5/a/044a70d93ceb966ed0d55dac9ab3b2afc2143a.png"],
		[":cate:", "/f/6/3ee343dff489684abe46da31e4b0000309ca68.png"],
		[":bat:", "/2/7/74e6002f4882e07a3a71a88164724ee8b33120.png"],
		[":greg:", "/3/3/a01c79a85f3f50a73c9e1a3a044a41ef75ed36.png"],
		[":coolWraith:", "/b/4/aff52f802d182c14dac7db8f314d8bec0f454b.png"],
		[":cadenceFlomp:", "/0/c/1934d75fef48b30c3d87f49739121d33f33429.png"],
		[":cadenceDeath:", "/3/4/5db2948cf10299323316f41acb65b5c5babd0c.png"],
		[":cadenceHype:", "/1/7/71298fc96e5e1d5049460a609c94636cfe3b7b.png"],
		[":nikoCrumbs:", "/d/4/85a1ff95b42a0111097805318dd0771d87d9db.png"],
		[":mole:", "/b/2/d5963e4bd823435010b7a673d97fadbfb3b6d2.png"],
		[":slime:", "/d/b/7de08780a029ca39b61ed65c9a7049439ef8ba.png"],
	];
	window.addEventListener("load", loadFunction, false);

	function loadFunction() {
		//change emojis on post submit
		AoPS.Community.Views.NewReply.prototype.submitPost = (function () {
			var cached_function = AoPS.Community.Views.NewReply.prototype.submitPost;
			return function () {
				var textAreas = document.querySelectorAll(".cmty-post-textarea");

				for (let i = 0; i < textAreas.length; i++) {
					console.log(textAreas[i].value);
					for (let j = 0; j < emojiList.length; j++) {
						textAreas[i].value = textAreas[i].value.replaceAll(
							emojiList[j][0],
							"[img width=7]https://cdn.artofproblemsolving.com/attachments" + emojiList[j][1] + "[/img]"
						);
					}
				}

				var result = cached_function.apply(this, arguments);
				return result;
			};
		})();

		//add emojis to the emoji bbcode thing. 90% of this is copy and pasted from the original function.
		AoPS.Community.Views.PostingEnviron.prototype.createSubMenu = function ($button, submenu) {
			var $submenu = $('<div class="cmty-posting-submenu"></div>'),
				button_position = $button.position(),
				self = this,
				has_announce = false,
				extra_options,
				$smiley_holder;
			switch (submenu) {
				case "font_color":
					$submenu.addClass("cmty-posting-submenu-font-color");
					_.each(AoPS.Community.Constants.bbCode.font_colors, function (color) {
						var $swatch;

						$swatch = $('<div class="cmty-posting-font-color-swatch"></div>')
							.css({
								"background-color": color,
							})
							.on("click", function () {
								self.applyBbCode(
									_.extend($button.data("button_settings"), {
										secondary: color,
									})
								);
							});
						$submenu.append($swatch);
					});
					break;

				//this smiley case is the only part that was modified
				case "smiley":
					$submenu.addClass("cmty-posting-submenu-smileys");

					$smiley_holder = $('<div class="cmty-posting-smiley-holder"></div>');
					//specifically this .each part
					_.each(emojiList, function (smiley) {
						var $smiley;

						$smiley = $(
							'<img style="width:30px" src="https://cdn.artofproblemsolving.com/attachments' +
								smiley[1] +
								'" alt="' +
								smiley[0] +
								'" title="' +
								smiley[0] +
								'" class="bbcode_smiley">'
						);
						//  Need a space around the smiley code to get bbCode to see it.
						$smiley.on("click", function () {
							self.replaceTextareaSelection(" " + smiley[0] + " ");
						});
						$smiley_holder.append($smiley);
					});
					_.each(AoPS.Community.Constants.bbCode.smileys, function (smiley) {
						var $smiley;

						$smiley = $(
							'<img src="/assets/images/smilies/' + smiley[1] + '" alt="' + smiley[0] + '" title="' + smiley[0] + '" class="bbcode_smiley">'
						);
						//  Need a space around the smiley code to get bbCode to see it.
						$smiley.on("click", function () {
							self.replaceTextareaSelection(" " + smiley[0] + " ");
						});
						$smiley_holder.append($smiley);
					});
					$submenu.append(AoPS.Community.Views.buildCommunityScrollbar($smiley_holder));
					break;

				case "font_size":
					$submenu.addClass("cmty-posting-submenu-sizes");

					_.each(AoPS.Community.Constants.bbCode.font_sizes, function (size) {
						var $size = $('<div class="cmty-posting-font-size" style="font-size:' + size.size + '%">' + size.text + "</div>").on(
							"click",
							function () {
								self.applyBbCode(
									_.extend($button.data("button_settings"), {
										secondary: size.size,
									})
								);
							}
						);

						$submenu.append($size);
					});
					break;

				case "extra_options":
					$submenu.addClass("cmty-posting-submenu-extras");
					extra_options = AoPS.Community.Constants.bbCode.extra_options;

					if (this.canSetAnnounce()) {
						extra_options = extra_options.concat([
							{
								property: "is_local_announcement",
								text: Lang["post-environ-extra-announce"],
								class_id: "cmty-post-extra-local-announce",
							},
						]);
						has_announce = true;
					}

					if (this.canSetGlobalAnnounce()) {
						extra_options = extra_options.concat([
							{
								property: "is_global_announcement",
								text: Lang["post-environ-global-announce"],
								class_id: "cmty-post-extra-global-announce",
							},
						]);
						has_announce = true;
					}

					_.each(extra_options, function (extra_option) {
						var pre_checked;

						if (!self.has_email_subscribe && extra_option.property === "notify_email") {
							return;
						}

						if (!self.has_add_to_feed && extra_option.property === "bookmark_feed") {
							return;
						}

						pre_checked = self.extra_options.hasOwnProperty(extra_option.property) && self.extra_options[extra_option.property];

						var $input = $(
							'<label><input name="' +
								extra_option.class_id +
								'" type="checkbox"' +
								(pre_checked ? " checked" : "") +
								"> " +
								extra_option.text +
								"</label><br>"
						).on("click", function (e) {
							self.is_building_subwindow = true;
							self.extra_options[extra_option.property] = e.target.checked;
						});
						$submenu.append($input);
					});

					if (has_announce) {
						this.$announce_through = $(
							'<div class="cmty-posting-announce-extra">' +
								Lang["post-environ-announce-through"] +
								'<br><input type="text" class="cmty-posting-announce-through" placeholder="yyyy-mm-dd"></div>'
						);
						$submenu.append(self.$announce_through);
						this.$announce_through.on("click", function (e) {
							e.stopPropagation();
						});
						ComViews.makeAnnounceDateInput(self.$announce_through.find("input"));
					}

					break;
			}
			$submenu.css({
				left: button_position.left + parseInt($button.css("margin-left")),
				top: button_position.top + $button.height(),
			});

			return $submenu;
		};

		//
	}
})();

