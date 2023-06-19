import { useEffect } from "react"

const READY_MESSAGE = { 
  kind: 'transaction-client-ready'
}

const Transaction = () => {

  useEffect(() => {
    window.addEventListener('message', async event => {
      const message = event.data;
      console.log('transaction-client', event);
      if (message.kind === 'transaction-client') {
       
      }
    });

    // Send a message to indicate we're ready.
    // NOTE: Because `window.opener.origin` cannot be accessed, this message
    // is sent with "*" as the target origin. This is safe as no sensitive
    // information is being communicated here.
    window.opener?.postMessage(READY_MESSAGE, '*');

  }, [])

  return (
    <div className="app-body">

      <p>transaction</p>
    </div>
  )
}

export default Transaction