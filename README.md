# streamZ

use discord to remote control a web browser to stream videos and open web sites

## setup

first install nodejs and chrome.  

then you need to navigate to https://discord.com/developers and make a bot once you have done that place the bots token in the .env file next to `TOKEN=` and then input your google login if you don't want that annoying popup and google messing about.


now install the packages by doing `npm i`.


once that is done open the config file and add the admin users which can go to any url and stop the bot.

then add the role id that can control the bot.

once that is all done do `npm run start` and it will open a web browser you can then control it from discord.

to stream to discord you will need to make an alt user account download the app and stream that way the discord bot api does **not** allow you to stream video so don't ask how to do this.

<br>  

## commands

`v!play <url>` - will navigate the browser to that url.

`v!f` - makes youtube fullscreen.

`v!t` - makes youtube cinema mode.

`v!k`, `v!pause` - will toggle play pause for youtube.

<br>

## contact and support for problems

discord: https://discord.gg/RYQbmj7

email: invaliduser@bruvland.com