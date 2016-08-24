Project name: MyPolity

Team members with primary role:
Gary Jackemuk (jackemuk), Git Master, backend
Jemma Tiongson (jemmamariex3), backend
Spencer Charest (spencercharest), frontend
Colin McDaniel (colinmcdaniel), frontend

External libraries used:
Bootstrap
Google Fonts
Slick
JQuery
Firebase

APIs used:
GoogleGeo (get user's browser location)
GoogleCivic (The Civic Information API allows developers to build applications that let citizens and voters know about their political representation and voting locations based on a given address.
https://developers.google.com/civic-information/)
NewsAPI.org (for getting news articles)
Microsoft Bing (for search functionality)
Sunlight Labs: OpenStates (Information on the legislators and activities of all 50 state legislatures, Washington, D.C. and Puerto Rico.  http://sunlightlabs.github.io/openstates-api)
Sunlight Labs: OpenCongress v3 (A live JSON API for the people and work of Congress. Information on legislators, districts, committees, bills, votes, as well as real-time notice of hearings, floor activity and upcoming bills.  https://sunlightlabs.github.io/congress)

Overview:
MyPolity is a web app that gives users information about the federal, state and local government representatives. 

Functionality:
Users create a profile with their name, address, email and password. Once user input is validated (by both Firebase and in our Javascript code), this information is stored as a Firebase object and the email and password is stored in Firebase's user authentication system. An ajax call gets unique IDs for the user's representatives and stores this inside the user object as well. A table is outputted with each representative's contact information, such as name, title, party, phone number, and email address. Users can click each individual representative for further information. Users can choose to see their representatives on a federal, state or local level by clicking on the header tab. On the representative table output, Democrats are represented with a blue background, and Republicans are represented by a red background. Users are also given links to related news articles. Users can log out and edit their profile information, which subsequently updates Firebase.