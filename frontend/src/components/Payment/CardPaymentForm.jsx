import React, { Component } from 'react';
import "antd/dist/antd.css";
import "../../assets/css2.css";
import { Row , Col , Button , Divider , Form, Input, Radio , notification} from 'antd';
import { MobileOutlined , CreditCardOutlined } from '@ant-design/icons';
import  { Redirect, Link } from 'react-router-dom'

class CardPaymentForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showOTP_Visibility : true,
            submitOTP_Visibility : false,
            confirmPay_Visibility : false,
            OTPInput_Visibility : false,
            DisabledInputs: false,
            isMobile:false,
            cardHolderName : '',
            cardNo : '',
            CVC : '',
            type : 'Visa',
            expDate : '',
            email : '',
            phone : '',
            OTP : '',
            OTPToken : '',

            itemCost: '',
            deliveryCost : '',
            buyerName: '',
            buyerID : '' , 
            fullAmmount : '',
            city : '',
            cart_id : ''
        }
        //const  history = useHistory();
    }

      setValueOnChange = (val) =>{
          console.log('field checked', val.target.value);
          this.setState({[val.target.name] :val.target.value});
      }
      setValueOnChangeRadio = (val) =>{
          console.log('radio checked', val.target.value);
          this.setState({type:val.target.value});
      }

      checkValidity = () => {
          console.log('Validity method called');
          
          const CardDetails = {
            cardHolderName : this.state.cardHolderName,
            cardNo : this.state.cardNo,
            CVC : this.state.CVC,
            type : this.state.type,
            expDate : this.state.expDate,
            email : this.state.email,
            phone : this.state.phone,
          }

          console.log('cardNO', this.state.cardNo);
          console.log('cardNO', this.state.type);

          fetch('http://172.18.0.1:8280/payment/cardPayment/'+ this.state.cardNo, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(CardDetails),
          })
          .then(response => { 
              //console.log('response is : ' + response.json())
              response.json().then(data2 => {
                  console.log('data inside Div' , data2)
                  console.log('Token is: ' , data2.Token)
                  let AuthHeader = 'Token ' + data2.Token;
                  this.setState({OTPToken:AuthHeader});
                  //console.log(data2.CardPaymentGateway[0].cardNo)
              })
              if(response.status == 200){
                notification['success']({
                        message: 'We have Sent The OTP to your Email.',
                        description: 'Check Email and submit your OTP.'
                });
                this.setState({submitOTP_Visibility : true});
                this.setState({OTPInput_Visibility : true});
                this.setState({showOTP_Visibility : false});
                this.setState({DisabledInputs : true});
              }
              else{
                  console.log(response.status)
                   notification['error']({
                        message: 'Invalid Card.',
                        description: 'Please Check the card details and try again..'
                });
              }
            })
          .catch((error) => {
            console.error('Error:', error);
            notification['error']({
              message: 'Something Went Wrong , Please Try Again!!',
              description:
                error,
            });
          });
       
      };

      checkOTP = () => {
          console.log('OTP method called');
          
          const _InputOTP = {
            OTP : this.state.OTP,
            cardNo : this.state.cardNo,
            CVC : this.state.CVC,
            type : this.state.type,
            expDate : this.state.expDate
          }
          fetch('	http://172.18.0.1:8280/payment/card/authOtp' , {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': this.state.OTPToken,
            },
            body: JSON.stringify(_InputOTP),
          })
          .then(response => { 
              console.log('response is : ' + response.json())
              if(response.status == 200){
                notification['success']({
                        message: 'OTP Matched.!!',
                        description: 'Please Confirm Your Payment.'
                });
                this.setState({submitOTP_Visibility : false});
                this.setState({OTPInput_Visibility : false});
                this.setState({confirmPay_Visibility : true});
              }
              else{
                  console.log(response.status)
                   notification['error']({
                        message: 'Invalid Card.',
                        description: 'Please Check the card details and try again..'
                });
              }
            })
          .catch((error) => {
            console.error('Error:', error);
            notification['error']({
              message: 'Something Went Wrong , Please Try Again!!',
              description: error,
            });
          });
       
      };

      makePayment = () => {
          console.log('Payment method called');
          
          const _InputOTP = {
            orderId:window.localStorage.getItem("cart_id"),
            userId : this.state.buyerID,
            Ammount : this.state.fullAmmount,
            cardNo : this.state.cardNo,
            accNo : "",
            type : this.state.type,
            isMobile : this.state.isMobile,
            email : this.state.email,
          }
          fetch('http://172.18.0.1:8280/payment' , {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(_InputOTP),
          })
          .then(response => { 
              console.log('response is : ' + response.json())
              if(response.status == 200){
                notification['success']({
                        message: 'Payment Succeeded.!!',
                });
                this.setState({submitOTP_Visibility : false});
                this.setState({OTPInput_Visibility : false});
                this.setState({confirmPay_Visibility : false});
                this.props.history.push('/MobilePayment');
              }
              else{
                  console.log(response.status)
                   notification['error']({
                        message: 'Something Went Wrong , Please Try Again!!',
                        description: 'Please Check the card details and try again..'
                });
              }
            })
          .catch((error) => {
            console.error('Error:', error);
            notification['error']({
              message: 'Something Went Wrong , Please Try Again!!',
              description: error,
            });
          });
       
      };
      
      componentDidMount(){
        console.log('cartitems : ' , window.localStorage.getItem("cartitems"))
        //console.log('Seller Id : ' , window.localStorage.getItem("cartitems")[0]["sellerId"])
        console.log('total item cost: ' , window.localStorage.getItem("total"))
        console.log('delCost : ' , window.localStorage.getItem("delCost"))
        console.log('buyer-name : ' , window.localStorage.getItem("buyer-name"))
        console.log('buyer-id : ' , window.localStorage.getItem("buyer-id"))
        console.log('City : ' , window.localStorage.getItem("del_location"))
        
        var iCost = JSON.parse(window.localStorage.getItem("total"));
        var dCost = JSON.parse(window.localStorage.getItem("delCost"));
        console.log('dCost : ' , dCost)
        var finalAmmount = parseFloat(iCost) + parseFloat(this.state.deliveryCost)

        this.setState({
            itemCost: JSON.parse(window.localStorage.getItem("total")),
            deliveryCost : JSON.parse(window.localStorage.getItem("delCost")),
            buyerName: window.localStorage.getItem("buyer-name"),
            buyerID : JSON.parse(window.localStorage.getItem("buyer-id")) , 
            city : window.localStorage.getItem("city"), 
            fullAmmount : (parseInt(window.localStorage.getItem("delCost")) + parseInt(window.localStorage.getItem("total"))).toFixed(2)
        })
    }

    render(){

        const {showOTP_Visibility , submitOTP_Visibility , confirmPay_Visibility , OTPInput_Visibility , DisabledInputs} = this.state;

        return(
            <section align="vertical"  style={{ paddingTop: '30px' }} bordered>
               
               <h1 className="lightText" style={{fontSize:35 , fontWeight:'bold'}}>PAY BY CARD</h1>
                < Row justify="space-around" align="middle">
                        <Col className="gutter-row" span={20}  offset={2}>
                            <Link to="/MobilePayment" type="primary" size={'large'} icon={<MobileOutlined style={{ fontSize: '150%'}} />} style={{height:60 , fontSize: '160%' , fontWeight:'bold'}} block>Switch To Mobile Payment</Link>
                        </Col>
                </Row>
                <Row justify="space-around" align="middle">
                    <Col span={21}  offset={0} >
                        <Divider style={{fontSize:25 , color:"#FFFFFF"}} orientation="left" >Payment Information</Divider>
                    </Col>
                </Row>
                <Form layout="vertical" >

                    <Row>
                       <Col className="gutter-row" span={20} offset={3}>
                           <Form.Item label="Select Your Card Type" style={{color:"#FFFFFF"}} name="type" onChange={this.setValueOnChangeRadio}>
                                <Radio.Group defaultValue="VISA" size="large" buttonStyle="solid">
                                    <Radio.Button span={6} value="VISA"><i className="fab fa-cc-amex"></i> Visa</Radio.Button>
                                    <Radio.Button span={6} value="MASTER"><i className="fab fa-cc-mastercard"></i> Master Card</Radio.Button>
                                    <Radio.Button span={6} value="AMEX"><i className="fab fa-cc-amex"></i> American Express</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Col> 
                    </Row>
                    

                    <Row>
                        <Col className="gutter-row" span={20} offset={3}>
                            <Form.Item required >
                                <Input disabled={this.state.DisabledInputs} className="PaymentInputs" placeholder="Name On Card" name="cardHolderName" onChange={this.setValueOnChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="gutter-row" span={20} offset={3}>
                            <Form.Item required>
                                <Input disabled={this.state.DisabledInputs} className="PaymentInputs" placeholder="Credit Card Number" name="cardNo" onChange={this.setValueOnChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col className="gutter-row" span={9} offset={3}>
                            <Form.Item required>
                                <Input disabled={this.state.DisabledInputs} className="PaymentInputs" placeholder="MM/YY" name="expDate" onChange={this.setValueOnChange} />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={10} offset={1}>
                            <Form.Item required>
                                <Input disabled={this.state.DisabledInputs} className="PaymentInputs" placeholder="CVC" name="CVC"  onChange={this.setValueOnChange}/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row className="commonSeperator">
                        <Col className="gutter-row" span={7} offset={2}>
                            <h2 className="lightText">Total Payment</h2>
                        </Col>
                        <Col className="gutter-row" span={5} offset={2}>
                            <hr className="lightText" style={{marginTop:20 , background:"#FFFFFF"}}></hr>
                        </Col>
                        <Col className="gutter-row" span={4} >
                            <h2 className="lightText">${this.state.fullAmmount}</h2>
                        </Col>
                    </Row>

                    <Row style={{paddingTop:40 , display:(showOTP_Visibility ? 'block' : 'none')}}>
                        <Col className="gutter-row" span={14} offset={6}>
                            <Form.Item>
                                <Button className="mySuccessBtn" type="primary" onClick={this.checkValidity} block>Request OTP</Button>
                                
                            </Form.Item>
                        </Col>
                        
                    </Row>

                    
                </Form>
                    <Row style={{paddingTop:40 , display:(OTPInput_Visibility ? 'block' : 'none') }} >
                        <Col className="gutter-row" span={10} offset={8}>
                            <Form.Item required>
                                <Input className="PaymentInputs" placeholder="OTP" name="OTP" onChange={this.setValueOnChange} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row style={{paddingTop:10 ,display:(submitOTP_Visibility ? 'block' : 'none') }}>
                        <Col className="gutter-row" span={14} offset={6}>
                            <Form.Item>
                                <Button className="mySuccessBtn" type="primary" onClick={this.checkOTP} block>Submit OTP</Button>
                            </Form.Item>
                        </Col>
                        
                    </Row>

                    <Row style={{paddingTop:40 , display:(confirmPay_Visibility ? 'block' : 'none') }}>
                        <Col className="gutter-row" span={14} offset={6}>
                            <Form.Item>
                                <Button className="mySuccessBtn" type="primary" onClick={this.makePayment}  block>Confirm Payment</Button>
                            </Form.Item>
                        </Col>
                        
                    </Row>
                
            </section>

            


        );
    }
}

export default CardPaymentForm;