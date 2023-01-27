import { useEffect } from 'react';
import { useDispatch } from'react-redux';
import config from '../config.json';
import '../App.css';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange
} from '../store/interactions';

import Navbar from './Navbar';

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // Connect Ethers to the blockchain
    const provider = loadProvider(dispatch)

    // Fetch the networks ChainID (e.g. hh:31337)
    const chainId = await loadNetwork(provider, dispatch)
    
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Fetch currenct account and balance from metamask when changed
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })

    // Load Token Smart Contract
    const Tony = config[chainId].Tony
    const mETH = config[chainId].mETH
    await loadTokens(provider, [Tony.address, mETH.address], dispatch) 
    
    // Load exchange contract
    await loadExchange(provider, config[chainId].exchange.address, dispatch)
  }
    
  useEffect(() => {
    loadBlockchainData();
  })

  return (
    <div>

      <Navbar/>

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
