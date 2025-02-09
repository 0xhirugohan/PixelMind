curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"images": ["https://ipfs.moralis.io:2053/ipfs/QmPevtQNmmuCCAx6pcQhbAeMCcpnziyNzeqZqutA3X4S6c/3193.png","https://ipfs.moralis.io:2053/ipfs/QmPevtQNmmuCCAx6pcQhbAeMCcpnziyNzeqZqutA3X4S6c/3192.png","https://ipfs.moralis.io:2053/ipfs/QmPevtQNmmuCCAx6pcQhbAeMCcpnziyNzeqZqutA3X4S6c/3191.png","https://ipfs.moralis.io:2053/ipfs/QmPevtQNmmuCCAx6pcQhbAeMCcpnziyNzeqZqutA3X4S6c/3190.png","https://ipfs.moralis.io:2053/ipfs/QmPevtQNmmuCCAx6pcQhbAeMCcpnziyNzeqZqutA3X4S6c/3189.png"], "prompt": "kid playing with a cat"}' \
  http://localhost:3000/input-art-prompt

