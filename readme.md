# Zwipe

Swipe Tinder on your bike

### Requirements

- ANT+ speed sensor.
- ANT+ USB stick.

### Setting up (Do this once)

- Install [NodeJS v12+](https://nodejs.org/) on your PC.
- Plug the ANT+ USB stick to your PC.
- Install driver using [Zadig](https://zadig.akeo.ie/) to install the WinUSB driver for your ANT+ USB stick. Open Zadig
  and goto menu "
  Options" select "List All Device", find "ANT USBStick2". Select "WinUS" and press install driver button. Other
  platform see https://github.com/Loghorn/ant-plus
- Install [Zwipe Chrome extension](https://chrome.google.com/webstore/detail/bbaopcbihfmndeedafhcafpojpibkgic)
- Download and extract the Zwipe zip file from the release page: https://github.com/artiya4u/zwipe/releases

### How to use

- Run Zwipe on your PC using command `node zwipe.js`
- Goto Tinder and login to the web app: https://tinder.com/app/recs
- Ride at your tempo for 100m to pass a Tinder profile.
- Attack to like a Tinder profile by increasing your speed more than 20% of your average speed.
- Sprint to super like a Tinder profile by increasing your speed more than 30% of your average speed. 
  Like when not enough super like.
