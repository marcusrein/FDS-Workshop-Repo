import { Transfer as TransferEvent } from "../generated/Beanz/Beanz";
import { json, Bytes, dataSource, log } from "@graphprotocol/graph-ts";

import { Token, TokenMetadata, User } from "../generated/schema";

import { TokenMetadata as TokenMetadataTemplate } from "../generated/templates";

const ipfshash = "QmdYeDpkVZedk1mkGodjNmF35UNxwafhFLVvsHrWgJoz6A";

export function handleTransfer(event: TransferEvent): void {
	let token = Token.load(event.params.tokenId.toString());
	if (!token) {
		token = new Token(event.params.tokenId.toString());
		token.tokenID = event.params.tokenId;

		// Creating the tokenIpfsHash
		token.tokenURI = "/beanz_metadata/" + event.params.tokenId.toString();
		const tokenIpfsHash = ipfshash + token.tokenURI;
		token.ipfsURI = tokenIpfsHash;
		token.owner = event.params.to.toHexString();

		// Create the TokenMetadata template based off the tokenIpfsHash that was created when the Transfer event was emitted

		TokenMetadataTemplate.create(tokenIpfsHash);
	}

	token.updatedAtTimestamp = event.block.timestamp;
	token.save();

	let user = User.load(event.params.to.toHexString());
	log.info("User LOG: {}", [event.params.to.toHexString()]);

	if (!user) {
		user = new User(event.params.to.toHexString());
		user.save();
	}
}

export function handleMetadata(content: Bytes): void {
	let tokenMetadata = new TokenMetadata(dataSource.stringParam());
	const value = json.fromBytes(content).toObject();
	if (value) {
		const image = value.get("image");
		const name = value.get("name");
		const attributes = value.get("attributes");

		if (name && image && attributes) {
			tokenMetadata.name = name.toString();
			tokenMetadata.image = image.toString();
			const attributesArray = attributes.toArray();

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
