Who's your step daddy!!??
=====

Multi user collaborative step sequencer. Several users can connect with their mobile devices or desktops and play a step sequencer together hosted on one of the devices connected. 
One device will be able to act as the main controller for all sound controlling filter and pitch.

### Setup

1. Install dependencies by running **make** from the root folder.
2. Run server by going into the server folder and running **./run.sh**
3. Run clients by going into the clients folder and running **./run.sh**

### How to use it

1. Open namespaces.js and change the windows.SERVER with the IP of your server.
2. Open your browser and go to http://<yourip>/clients/mixer. By default the mixer client creates and joins a room called Mixer_room_1.
3. Open another browser (mobile, tablet, browser) and browse to clients/device or clients/fx. Each client will get an instrument from the synthesizer and the fx app is responsible for adding two effects.
