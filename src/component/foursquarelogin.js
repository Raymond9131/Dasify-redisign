import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";

class FourSquareLogin extends Component {
  state = {
    url: "",
    username: "",
    password: "",
    log: false,
    isUrl: false,
    username_error: "",
    password_error: "",
    url_error: "",
    wrong: "",
    loading: false
  };

  onSubmit = e => {
    e.preventDefault();
    //  this.setState({log:false})
    // this.props.login(this.state.username, this.state.password);
    // return <Redirect to="/locationdetails" />

    this.setState({
      username_error: "",
      password_error: "",
      url_error: "",
      wrong: ""
    });

    if (this.state.username == "") {
      this.setState({
        username_error: "Enter your Email"
      });
    }
    if (this.state.password == "") {
      this.setState({ password_error: "Enter your password" });
    }
    if (this.state.url == "") {
      this.setState({ url_error: "Enter Url" });
      console.log("i am in console");
    }
    this.setState({ loading: true });

    const DjangoConfig = {
      headers: { Authorization: "Token " + localStorage.getItem("UserToken") }
    };

    // const fourUrl = this.state.url.split("/")[5];
    // localStorage.setItem("fourUrl", fourUrl);

    const data = {
      location_id: localStorage.getItem("locationId"),
      Platform: "Foursquare",
      Token: "",
      Username: this.state.username,
      Email: "",
      Password: this.state.password,
      Connect_status: "Connect",
      Other_info: "{'URL':" + this.state.url + ",'data':''}"
    };

    Axios.get(
      "https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v2/venues/" +
        this.state.url.split("/")[5] +
        "?client_id=TEUSFAUY42IR0HGTPSWO1GFLC5WHX3PIBKVICAQRZQA0MTD1&client_secret=CYBQFK0YRBPFE54NARAEJCG2NLBARIU2OOIJNE0AZOHWZTXU&v=20180323"
    )
      .then(res => {
        if (res.data.response.venue) {
          Axios.post(
            "https://cors-anywhere.herokuapp.com/https://dashify.biz/social-platforms/add-account",
            data,
            DjangoConfig
          )
            .then(resp => {
              console.log(resp);
              this.setState({ isUrl: true, loading: false });
            })
            .catch(resp => {
              alert("Invalid username or password");
              console.log(resp);
              this.setState({
                wrong: "Invalid or Not authorised",
                loading: false
              });
            });
        } else {
          alert("Invalid username or password");
          this.setState({ loading: false });
        }
      })
      .catch(res => {
        alert("Invalid username or password");
        this.setState({ loading: false });
      });
  };

  render() {
    if (this.state.isUrl) {
      return (
        <Redirect
          to={
            "/dashboard#/locations/" +
            localStorage.getItem("locationId") +
            "/view-listing"
          }
        />
      );
    }

    return (
      <div>
        <div className="foursquer-logo">
          <img src={require("../images/foursquare.png")} alt="" />
        </div>
        <div className="login_form">
          <form onSubmit={this.onSubmit}>
            <fieldset className="login_fieldset">
              <legend>Login</legend>
              {this.state.loading ? (
                <Loader
                  type="Oval"
                  color="#00BFFF"
                  height={25}
                  width={25}
                  // timeout={3000} //3 secs
                />
              ) : (
                <div style={{ color: "red" }}>{this.state.wrong}</div>
              )}
              <p>
                <label htmlFor="url">Foursquare Listing Url</label>
                <input
                  type="text"
                  id="url"
                  value={this.state.url}
                  placeholder="https://foursquare.com/v/mudspot/3fd66200f964a520c4f11ee3"
                  onChange={e => this.setState({ url: e.target.value })}
                />
                <div style={{ color: "red" }}>{this.state.url_error}</div>
              </p>

              <p>
                <label htmlFor="username">Foursquare Email</label>
                <input
                  type="text"
                  id="username"
                  onChange={e => this.setState({ username: e.target.value })}
                />
                <div style={{ color: "red" }}>{this.state.username_error}</div>
              </p>
              <p>
                <label htmlFor="password">Foursquare Password</label>
                <input
                  type="password"
                  id="password"
                  onChange={e => this.setState({ password: e.target.value })}
                />
                <div style={{ color: "red" }}>{this.state.password_error}</div>
              </p>
              <p>
                {/* <button type="submit" ><Link to="/yelp">Login</Link></button> */}
                <button type="submit">Login</button>
              </p>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}

export default FourSquareLogin;
