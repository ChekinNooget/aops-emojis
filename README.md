# AoPS Custom Emojis
A userscript that allows you to add your own emojis and use them in posts.

First, download [tampermonkey](https://www.tampermonkey.net/), Then click [here](aops-emoji.user.js?raw=1) to download.

For example, if you type :cate: in a post, it will automatically replace it with the cate emoji to your post once you send it.

# Adding your own emojis
You need to edit the code in order to add your own emojis. First, upload the picture you want to a random aops post, then grab the url and add a new line to the array at the top named "emojiList". You can just copy and paste a different line to make a new one. The left side is the text replaced, the right side is the end part of the image's url. Hopefully you can figure that out i cant be bothered to type a more detialed explaination sorry. just go to the tampermonkey thing im sure yo ucan figure it out

# TODO
- Allow emojis to work on edits
- Disallow emojis from rendering from other user's quotes
- (probably impossible because of the way aops does images...) make the emoji size consistent between feed view and forum view
- Make it easier to upload your own emojis
- Sometimes emojis won't work at all if the page loads incorrectly and the code can't inject its custom functions in time. dunno how to fix, it's impossible, right?
