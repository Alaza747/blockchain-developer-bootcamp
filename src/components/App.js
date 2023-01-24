import { useEffect } from 'react';
import { method } from 'lodash';
import { ethers } from 'ethers';
import config from '../config.json';
import TOKEN_ABI from '../abis/Token.json';
import '../App.css';


function App() {

  const loadBlockchainData = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    console.log(`Account 0 address is:`, accounts[0])

    // Connect Ethers to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork(provider)
    console.log(`ChainID is:`, chainId)

    // Token Smart Contract
    const token = new ethers.Contract(config[31337].Tony.address, TOKEN_ABI, provider)
    console.log(`Token contract's address is:`, token.address)
    const symbol = await token.symbol()
    console.log(`Symbol is:`, symbol)
  }
    
  useEffect(() => {
    loadBlockchainData();
  })

  return (
    <div>

      {/* Navbar */}

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}
export default App;