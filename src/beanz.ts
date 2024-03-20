// GRAPH CODGEN GENERATES TYPE SAFETY BY REFERENCING SCHEMA.GRAPHQL AND SUBGRAPH.YAML. Its best practice to build subgraph.yaml and schema.graphql prior to arranging your src/mappings.ts file (in this case, mappings.ts was renamed to beanz.ts)

import { Transfer as TransferEvent } from "../generated/Beanz/Beanz";
// `graph codegen` generates types from the events in the Beanz contract. Here, we only import the `Transfer` type as `TransferEvent` instead of all of the events.
import { Token, TokenMetadata, User } from "../generated/schema";
// `graph codegen` generates the Token, TokenMetadata, and User types that are created from our entity definitions in the schema.graphql file.
import { TokenMetadata as TokenMetadataTemplate } from "../generated/templates";
// `graph codegen` generates the TokenMetadata template that is created from our template definition in subgraph.yaml

// IMPORT HELPERS FROM GRAPH-TS TO HANDLE THE METADATA:

import { json, Bytes, dataSource, log } from "@graphprotocol/graph-ts";
// Use `log` for error logging as needed. You can find the logs in your subgraph's Subgraph Studio's dashboard (www.thegraph.com/studio/subgraph/<yoursubgraphname>)

const ipfsHash = "QmdYeDpkVZedk1mkGodjNmF35UNxwafhFLVvsHrWgJoz6A";
// Define ipfshash that will be used as the base of the tokenIpfsHash in the handleTransfer function.

export function handleTransfer(event: TransferEvent): void {
	let token = Token.load(event.params.tokenId.toString());
	// Look in the subgraph's local store to see if the token has already been minted. If it has, load it by passing in its ID (tokenId is this Token's ID). If not, create a new Token entity and populate it with event data VVV

	if (!token) {
		token = new Token(event.params.tokenId.toString());
		token.tokenID = event.params.tokenId;

		// Create the tokenURI for both recordkeeping as well as to create the ipfsHashUri below VVV.
		token.tokenURI = "/beanz_metadata/" + event.params.tokenId.toString();

		// Create the iphsHashUri to trigger the TokenMetadata template that will create the TokenMetadata entity.
		const ipfsHashUri = ipfsHash + token.tokenURI;

		token.ipfsHashURI = ipfsHashUri;

		TokenMetadataTemplate.create(ipfsHashUri);
	}
	token.owner = event.params.to.toHexString();
	token.updatedAtTimestamp = event.block.timestamp;
	token.save();

	// Create a new User entity and pass in the 'to' address as its ID if it doesn't already exist.

	let user = User.load(event.params.to.toHexString());
	if (!user) {
		user = new User(event.params.to.toHexString());
		user.save();

		// Go to schema.graphql where we have linked the User.ID entity and the Token.owner entity through a Reverse Lookup. This is possible as they both have the same "to" address, linking each Token owned by the 'to' address to the User.ID address.
	}
}

// HANDLE METADATA FUNCTION TRIGGERED BY THE TOKENMETADATA TEMPLATE:

export function handleMetadata(content: Bytes): void {
	let tokenMetadata = new TokenMetadata(dataSource.stringParam());
	// Create a new TokenMetadata entity and pass in the dataSource as its ID. This is the ipfsHashUri that we created in the handleTransfer function above.

	const value = json.fromBytes(content).toObject();
	// Create a value variable that will be used to store the json object that is passed in as the content parameter.
	if (value) {
		const image = value.get("image");
		const name = value.get("name");
		const attributes = value.get("attributes");

		// Assemblyscript needs to have nullchecks. If the value exists, then we can proceed with the creating an image, name, and attributes variable gathered from the json object.

		if (name && image && attributes) {
			tokenMetadata.name = name.toString();
			tokenMetadata.image = image.toString();
			const attributesArray = attributes.toArray();

			// Assign the name and image object to the tokenMetadata.name and tokenMetadata.image fields. Then, create an attributesArray variable that will be used to store the attributes object as an array. Converting to an array allows us to first loop through the array with the `switch` statement below, then assign the trait_type and value to the tokenMetadata fields.

			if (attributesArray) {
				for (let i = 0; i < attributesArray.length; i++) {
					const attributeObject = attributesArray[i].toObject();
					const trait_type = attributeObject.get("trait_type");
					const value = attributeObject.get("value");

					if (trait_type && value) {
						switch (i) {
							case 0:
								tokenMetadata.traitType0 = trait_type.toString();
								tokenMetadata.value0 = value.toString();
								break;
							case 1:
								tokenMetadata.traitType1 = trait_type.toString();
								tokenMetadata.value1 = value.toString();
								break;
							case 2:
								tokenMetadata.traitType2 = trait_type.toString();
								tokenMetadata.value2 = value.toString();
								break;
							case 3:
								tokenMetadata.traitType3 = trait_type.toString();
								tokenMetadata.value3 = value.toString();
								break;
							case 4:
								tokenMetadata.traitType4 = trait_type.toString();
								tokenMetadata.value4 = value.toString();
								break;
							case 5:
								tokenMetadata.traitType5 = trait_type.toString();
								tokenMetadata.value5 = value.toString();
								break;
							case 6:
								tokenMetadata.traitType6 = trait_type.toString();
								tokenMetadata.value6 = value.toString();
								break;
							case 7:
								tokenMetadata.traitType7 = trait_type.toString();
								tokenMetadata.value7 = value.toString();
								break;
							case 8:
								tokenMetadata.traitType8 = trait_type.toString();
								tokenMetadata.value8 = value.toString();
								break;
						}
					}
				}
			}
			tokenMetadata.save();
		}
	}
}
