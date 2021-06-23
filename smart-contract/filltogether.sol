// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

import './KIP17TokenModified.sol';

contract FillTogether {
    mapping(string => mapping(uint256 => address)) public owner;
    
    function buyPosition(string memory artworkId, uint256 pos, address adminWallet) public payable returns (bool) {
        require(owner[artworkId][pos] == address(0x00), "already sold");
        
        address payable receiver = address(uint160(adminWallet));
        receiver.transfer(10 ** 16);
        owner[artworkId][pos] = msg.sender;
        return true;
    }
    
    function mintNFT(address NFTAddress, address adminWallet, uint256 tokenId, string memory tokenURI) public returns (bool) {
        KIP17Token(NFTAddress).mintWithTokenURI(adminWallet, tokenId, tokenURI);
        return true;
    }
    
    // TODO
    // NFT 경매연동 + 수익분배
    
}
