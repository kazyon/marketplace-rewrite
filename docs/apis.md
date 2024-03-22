External APIs used

# [Helius](https://www.helius.dev/)
This API is used to get NFT information, currently these are the endpoints used 

* `getAsset`
* `getAssetsByOwner`
* `getAssetsByGroup`
* `getAssetBatch`

The documentation for each of them can be found at https://docs.helius.dev/compression-and-das-api/digital-asset-standard-das-api

The advantage of Helius's API
* generally quick
* offers a large pagination size (up to 1000 assets per page) and it's also pretty cost effective

The disadvantages 
* (relatively) frequent issues in regard to the delay, sometimes an asset is created on the blockchain 
* there is little option to customize the return format (for example it doesn't handle cases where an empty collection is created)


# Google Maps

* [Autocomplete API](https://developers.google.com/maps/documentation/places/web-service/autocomplete) is used to get the autocomplete results for the address field
* [Places Details API](https://developers.google.com/maps/documentation/places/web-service/details) used in conjunction with autocomplete to get more details for the selected autocomplete result

# [Coingecko](https://www.coingecko.com/en/api)

Used for showing solana to other currencies parity (for example showing the current SOL price in USD)
