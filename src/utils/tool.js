export const isJSON = str => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

const ethereum = window.ethereum;

export const getCurChain = fn => {
  if(ethereum){
    ethereum.request({ method: 'eth_chainId' }).then(res => fn(res));
  }
}

export const chainChange = fn => {
  if(ethereum){
    ethereum.on('chainChanged',res => fn(res))
  }
}

export const getAddress = fn => {
  if(ethereum){
    ethereum.request({ method: 'eth_requestAccounts' }).then(res => fn(res));
  }
}

export const addressChannge = fn => {
  if(ethereum){
    ethereum.on('accountsChanged', res => fn(res));
  }
}

export const getBalance = (address,fn) => {
  if(ethereum){
    ethereum.request({
      "method":"eth_getBalance",
      "jsonrpc":"2.0",
      "id":1,
      "params":[address, "latest"]
    }).then(res => fn(res))
  }
}

export const walletChainSwitch = (fn,chainId) => {
  if(ethereum){
    ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    }).then(res => fn(res))
    .catch(err => {
      console.log('newwork wrong:' + err)
    })
  }
}

export const walletChainAdd = fn => {
  if(ethereum){
    ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        { 
          chainId: '0x7e9',
          chainName: 'Rangers Protocol Mainnet',
          nativeCurrency: {
          name: 'Rangers Protocol Mainnet',
          symbol: 'RPG',
          decimals: 18
        },
        rpcUrls: ['https://mainnet.rangersprotocol.com/api/jsonrpc'],
        blockExplorerUrls: ['https://scan.rangersprotocol.com'],
      }]
    }).then(res => fn(res))
    .catch(err => {
      console.log('newwork wrong:' + err)
    })
  }
}












