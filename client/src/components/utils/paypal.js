import React, { Component } from 'react'
import PaypalExpressBtn from 'react-paypal-express-checkout'

class PayPal extends Component {
    render() {
        const onSuccess = (payment) => {
            this.props.onSuccess(payment)

            // {"paid":true,
            // "cancelled":false,
            // "payerID":"ZM3TCCZK25CQY",
            // "paymentID":"PAYID-MDM6U2A2RS01585XP3791101",
            // "paymentToken":"EC-1FV08491V1873772M",
            // "returnUrl":"https://www.paypal.com/checkoutnow/error?paymentId=PAYID-MDM6U2A2RS01585XP3791101&token=EC-1FV08491V1873772M&PayerID=ZM3TCCZK25CQY",
            // "address":{"recipient_name":"Horace Willie","line1":"1 Main St","city":"San Jose","state":"CA","postal_code":"95131","country_code":"US"},
            // "email":"Horacewillie7@gmail.com"}
        }

        const onCancel = (data) => {
            console.log(JSON.stringify(data))
        }

        const onError= (error) => {
            console.log(JSON.stringify(error))
        }
        let env = 'sandbox'
        let currency = 'USD'
        let total = this.props.toPay

        const client = {
            sandbox: 'AW4bJYZERKgkDc8sPQd4GhznUljkIyrs8okGv6j16hLm8QyItGM3HVsPCgXv89ByIsxfawOqEjNMo_48', 
            production: ''
        }
        return (
            <div>
                <PaypalExpressBtn 
                env = {env}
                client = {client}
                currency = {currency}
                total = {total}
                onError = {onError}
                onSuccess = {onSuccess}
                onCancel = {onCancel}
                style = {{
                    size: 'large',
                    color: 'blue',
                    shape: 'rect',
                    label: 'checkout'
                }}
                />
            </div>
        )
    }
}

export default PayPal

