##Project name: MyPolity

Team members with primary role:
- Gary Jackemuk (jackemuk), Git Master, backend
- Jemma Tiongson (jemmamariex3), backend
- Spencer Charest (spencercharest), frontend
- Colin McDaniel (colinmcdaniel), frontend

External libraries used:
Bootstrap,
Google Fonts,
Owl Carousel,
JQuery,
Firebase

APIs used:
GoogleGeo (to get the city and state of a zip code)
GoogleCivic (The Civic Information API allows developers to build applications that let citizens and voters know about their political representation and voting locations based on a given address.
https://developers.google.com/civic-information/)
Microsoft Bing (for news search functionality)
Sunlight Labs: OpenStates (Information on the legislators and activities of all 50 state legislatures, Washington, D.C. and Puerto Rico.  http://sunlightlabs.github.io/openstates-api)
Sunlight Labs: OpenCongress v3 (A live JSON API for the people and work of Congress. Information on legislators, districts, committees, bills, votes, as well as real-time notice of hearings, floor activity and upcoming bills.  https://sunlightlabs.github.io/congress)

Overview:
MyPolity is a web app that gives users information about their federal, state and local government representatives.

Functionality:
Users create a profile with their name, address, email and password. Once user input is validated (by both Firebase and in our Javascript code), this information is stored as a Firebase object and the email and password is stored in Firebase's user authentication system. An ajax call gets the user's representatives and creates an object for each representative that is stored in the user's profile on Firebase. A table is dynamically created with each representative's contact information, such as name, title, party, phone number, and email address. Users can click each individual representative for further information. Phone numbers, and emails are clickable for ease of use on mobile devices (clicking on the phone number will dial the number, clicking on the email will open an email draft). On the representative table output, Democrats are represented with a blue background, and Republicans are represented by a red background. Users are also given links to related news articles. Users can edit their profile information, which subsequently updates Firebase. A user can also search by zip code to see representatives from other areas of the US.
