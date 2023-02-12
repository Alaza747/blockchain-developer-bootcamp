import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { myEventsSelector } from "../store/selectors";


const Alert = () => {
    const alertRef = useRef(null);

    const account = useSelector(state => state.provider.account)

    const isPending = useSelector(state => state.exchange.transaction.isPending);
    const isError = useSelector(state => state.exchange.transaction.isError);
    const events = useSelector(myEventsSelector);

    const removeHandler = async (e) => {
        alertRef.current.className = 'alert alert--remove'
    }


    useEffect(() => {
        if ((isPending || isError) && account) {
            alertRef.current.className = "alert";
        }
    }, [isPending, isError, account])

    return (
        <div>
            {isPending ? (
                
                <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
                    <h1>Transaction Pending...</h1>
                </div>

            ) : isError ? (
                
                <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
                    <h1>Transaction Will Fail</h1>
                </div>

            ) : !isPending && events[0] ? (

                <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}>
                    <h1>Transaction Successful</h1>
                    <a
                        href=''
                        target='_blank'
                        rel='noreferrer'
                    >
                        {events[0].transactionHash.slice(0, 6) + '...' + events[0].transactionHash.slice(-6)}
                    </a>
                </div>

            ) : (
                <div className="alert alert--remove" onClick={removeHandler} ref={alertRef}></div>
            )}
        </div>
    );
}

export default Alert;