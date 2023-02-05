import { useSelector } from "react-redux";

import Banner from "./Banner";

const PriceChart = () => {
    const account = useSelector(state => state.provider.account);

    return (
      <div className="component exchange__chart">
        <div className='component__header flex-between'>
          <div className='flex'>
  
            <h2></h2>
  
            <div className='flex'>
              {/* <img src="" alt="Arrow down" /> */}
              <span className='up'></span>
            </div>
  
          </div>
        </div>
  
        {/* Price chart goes here */}

        {!account? (
            <Banner text={'Please connect with Metamask'} />
        ) : (
            <p>Price Chart placeholder</p>
        )}



  
      </div>
    );
  }
  
  export default PriceChart;