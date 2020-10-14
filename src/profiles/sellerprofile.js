import React, { Component } from "react";
import { NavLink, Route, withRouter } from "react-router-dom";
import NewBusinessForm from "../forms/newbusinessform"

class SellerProfile extends Component {

  state = {
    bids: [],
    businesses: [],
    txns: [],
  }

  componentDidMount(){
    let userID = this.props.profileData.activeUser.seller.id
    let bids = this.props.profileData.bids
    let assocBids = []
    for (let i=0; i<bids.length; i++){
      if(bids.length >0){
        if (bids[i].business.seller_id === userID){
          assocBids.push(bids[i])
        } else {
          return <h4>Currently, there are no active bids on your businesses.</h4>
        }
      }
      }
    this.setState(()=>({
      bids: assocBids,
      businesses: this.props.profileData.businesses.filter(biz => biz.seller_id === userID),
      txns: this.props.profileData.bids.filter(bid => bid.winning_bid && bid.business.seller_id === userID)
    }),()=> this.renderBidSummary())
  }


  renderSellerProfile = () => {
    let sellerProfile = this.props.profileData.activeUser.seller
    return (
      <div>
        <img src={sellerProfile.prof_pic} alt="" />
        <h3>
          Name: {sellerProfile.first_name}{" "}
          {sellerProfile.last_name}
        </h3>
        <h3>Email Address: {sellerProfile.email_address}</h3>
        <button onClick={this.logoutProfile}>Log-out</button>
        <button onClick={() => this.deleteProfile(sellerProfile.id)}>Delete Profile</button>
      </div>
    );
  };

  deleteProfile = (sellerID) =>{
    let options ={
      method: "DELETE",
      headers:{
        "content-type": "application/json",
        "accepts": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      }
    }
    fetch(`http://localhost:3000/sellers/${sellerID}`, options)
      .then((bid) => {
        this.props.history.push("/")
      });
  }

  logoutProfile = () =>{
    localStorage.setItem("token", "")
    this.props.history.push("/")
  }

  renderBusinesses = () =>{
    return this.state.businesses.map(biz =>{return (
      <div>
        <h4>{biz.name}</h4>
        <button onClick={() => this.deleteBusiness(biz.id)}>Delete Business</button>
      </div>
    )})
  }

  deleteBusiness = (bizID) => {
    let options ={
      method: "DELETE",
      headers:{
        "content-type": "application/json",
        "accepts": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      }
    }
    fetch(`http://localhost:3000/businesses/${bizID}`, options)
      .then((bid) => {
        this.props.removeBiz(bizID)
        this.setState(()=>({
          businesses: this.state.businesses.filter(bids => bids.id !== bizID)
        }))
        // this.history.push("/marketplace")
      });
  }

  

  renderBidSummary = () => {
    console.log(this.state.bids)
    return this.state.bids.map(bid => {
      return(
        <div>
        <h4>Business Name: {bid.business.name}</h4>
        <h4>Bid Price: ${bid.bid_price}</h4>
        <h4>Cash Consideration: {bid.cash_consid *100}%</h4>
        {(bid.winning_bid) ? <span></span>:
          <div>
        <button onClick={()=> this.localDeleteBidHandler(bid.id, bid.business_id)}>Delete Bid</button>
        <button onClick={()=> this.selectWinningBid(bid.id)}>Accept Bid</button>
          </div>
        }
        </div>
      )
    })
    }
  

  localDeleteBidHandler = (bidID) =>{
    let options ={
      method: "DELETE",
      headers:{
        "content-type": "application/json",
        "accepts": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      }
    }
    fetch(`http://localhost:3000/bids/${bidID}`, options)
      .then((bid) => {
        this.props.removeBidSeller(bidID)
        this.setState(()=>({
          bids: this.state.bids.filter(bid => bid.id !== bidID)
        }))
      });
  }

  selectWinningBid = (bidID) => {
    let options ={
      method: "PATCH",
      headers:{
        "content-type": "application/json",
        "accepts": "application/json",
        "Authorization": `Bearer ${localStorage.token}`
      },
      body: JSON.stringify({winning_bid: true})
    }
    fetch(`http://localhost:3000/bids/${bidID}`, options)
    .then(resp => resp.json())
      .then(bid => {
        let replaceBid = this.state.bids.find(bid => bid.id === bidID)
        replaceBid = bid
        this.setState(()=>({
          txns: [...this.state.txns, bid],
          bids: this.state.bids.pop(bid)
        }))
      });
  };

  renderTransactionSummary = () => {
    return this.state.txns.map(txn => {
      console.log(txn)
      return(
        <div>
        <h4>Business Name: {txn.business.name}</h4>
        <h4>txn Price: ${txn.bid_price}</h4>
        <h4>Cash Consideration: {txn.cash_consid *100}%</h4>
        </div>
      )
    })
  }



  render() {
    return (
      <div>
        <p>{this.renderSellerProfile()}</p>
        <NavLink to="/profile/newbusiness">
          <button>Upload a New Business</button>
        </NavLink>
        <Route path="/profile/newbusiness" render={()=> <NewBusinessForm profileData={this.props.profileData}/>} />
        <p>My Businesses</p>
        <p>{this.renderBusinesses()}</p>
        <p>My Bids</p>
        <p>{this.renderBidSummary()}</p>
        <h3>Completed Transactions</h3>
        <p>{this.renderTransactionSummary()}</p>
      </div>
    );
  }
}

export default withRouter(SellerProfile);
