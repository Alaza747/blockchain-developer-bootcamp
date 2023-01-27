import { useSelector } from 'react-redux';

import logo from '../assets/logo.png';

const Navbar = () => {
    const account = useSelector(state => state.provider.account)

    return(
        <div className="exchange__header grid">
            <div className="exchange__header--brand flex">
                <img src={logo} className="logo" alt='Tony Logo'></img>
                <h1>Tony Token Exchange</h1>
            </div>

            <div className="exchange__header--networks flex">

            </div>

            <div className="exchange__header--account flex">
                <a href=''>{account.slice(0,5) + '...' + account.slice(38,42)}</a>
            </div>
        </div>
    )
}

export default Navbar;