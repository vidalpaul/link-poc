# Start

Run the following command to start the server:
yarn dev

# Parties

Exchange = entity that holds a lot of $LINK and transfers them to Alice during the vendorLink.js scenario
Alice = a Bitfy user with an active Ethereum wallet, holding some ETH, who wants to trade $LINK
Bob = anyone owning an Ethereum wallet

# Scripts

index.js = serves the POST "send" endpoint
vendorLink.js = the script for replenishing Alice's $LINK
sendLink.js = the script for sending $LINK to Bob
