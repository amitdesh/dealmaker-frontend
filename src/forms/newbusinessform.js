import React, { Component } from "react";
import {withRouter} from "react-router-dom"

class NewBusinessForm extends Component {
  state = {
    name: "",
    location: "",
    industry: "",
    founder_name: "",
    biz_type: "",
    employees: "",
    revenue: "",
    description: "",
  };

  changeHandler = (e) => {
    e.persist();
    this.setState(() => ({
      [e.target.name]: e.target.value,
    }));
  };

  submitHandler = (e) => {
    e.preventDefault()
    e.persist()
    this.bizSubmitHandler()
    this.setState(()=>({
      [e.target.name]: ""
    }))
  }

  bizSubmitHandler = () =>{
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accepts: "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
      body: JSON.stringify({
        seller_id: this.props.profileData.activeUser.seller.id,
        name:this.state.name,
        location:this.state.location,
        industry:this.state.industry,
        founder_name:this.state.founder_name,
        biz_type:this.state.biz_type,
        employees:this.state.employees,
        revenue:this.state.revenue,
        description:this.state.description
        })};
    fetch("http://localhost:3000/businesses", options)
      .then((resp) => resp.json())
      .then((biz) => {
        console.log(biz);
        this.props.addBiz(biz)
        this.props.history.push("/marketplace")
      });
  }

  render() {
    return (
      <div>
        <form onSubmit= {this.submitHandler}>
          <label for="name">Business Name</label>
          <input
            type="text"
            name="name"
            value={this.state.name}
            placeholder="Enter business name"
            onChange={this.changeHandler}
          />
          <br></br>
          <label for="location">Business Location (HQ)</label>
          <input
            type="text"
            name="location"
            value={this.state.location}
            placeholder="Enter business HQ location"
            onChange={this.changeHandler}
          />
          <br></br>
          <label for="industry">Industry</label>
          <select name="industry" onChange={this.changeHandler}>
            <option value="Technology">Technology</option>
            <option value="Consumer-Retail">Consumer-Retail</option>
            <option value="Business Services">Business Services</option>
            <option value="Industrials">Industrials</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Energy">Energy</option>
          </select>
          <br></br>
          <label for="founder_name">Founder/CEO Name</label>
          <input
            type="text"
            name="founder_name"
            value={this.state.founder_name}
            placeholder="Enter founder/CEO name"
            onChange={this.changeHandler}
          />
          <br></br>
          <label for="biz_type">Type of Business</label>
          <select name="biz_type" onChange={this.changeHandler}>
            <option value="Self-Started">Self-Started</option>
            <option value="Family Business">Family Business</option>
            <option value="SME">SME</option>
            <option value="Investor-backed">Investor-backed</option>
            <option value="Institutional">Institutional</option>
          </select>
          <br></br>
          <label for="employees">Number of Employees</label>
          <input
            type="number"
            name="employees"
            value={this.state.employees}
            placeholder="Enter number of employees"
            onChange={this.changeHandler}
          />
          <br></br>
          <label for="revenue">Company Revenue</label>
          <input
            type="number"
            name="revenue"
            value={this.state.revenue}
            placeholder="Enter company revenue"
            onChange={this.changeHandler}
          />
          <br></br>
          <label for="description">Business Description</label>
          <textarea
            type="text"
            name="description"
            value={this.state.description}
            placeholder="Enter business description"
            onChange={this.changeHandler}
          />
          <br></br>
          <button type="submit">Create New Business Posting</button>
        </form>
      </div>
    );
  }
}

export default withRouter(NewBusinessForm);
