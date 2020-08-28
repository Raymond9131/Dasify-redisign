import React, { Component } from "react";
import Axios from "axios";

const DjangoConfig = {
  headers: {
    Authorization: "Token " + localStorage.getItem("UserToken")
  }
};

export default class CampaignPart2 extends Component {
  state = {
    cmapign_name: "",
    email_sendto_error: {},
    email_sendto_name: [],
    email_sendto_email: {},
    add_customer: 2
  };

  componentDidMount = () => {
    console.log("promotional data", this.props.location.state);
  };

  submitHandler = event => {
    event.preventDefault();

    var { cmapign_name, email_sendto_name, email_sendto_email } = this.state;

    let {
      email_from,
      all_site_name,
      all_site_url,
      email_replyto,
      email_subject,
      email_heading,
      email_content,
      review_by_google,
      review_by_apple,
      google_placeid,
      appleId
    } = this.props.location.state.promotional_data;

    var emails;

    Object.values(email_sendto_email).map((value, i) => {
      emails = { ...emails, [i]: value };
    });

    var additional_link_image1 = "",
      additional_link_image2 = "";

    Object.values(all_site_url).map((value, i) => {
      if (i == 0) {
        additional_link_image1 =
          '<br /><img src="https://img.techpowerup.org/200624/t-logo.jpg" alt="Review" height=100 width=100 /><p>' +
          all_site_name[i] +
          "</p><br /><button><a href=" +
          all_site_url[i] +
          ">Review</a></button>";
      }
      if (i == 1) {
        additional_link_image2 =
          "<br /><h1>" +
          all_site_name[i] +
          "</h1><br /><button><a href=" +
          all_site_url[i] +
          ">Review</a></button>";
      }
    });

    var message_content;

    const google_link =
      "https://search.google.com/local/writereview?placeid=" + google_placeid;
    const apple_link =
      "https://apps.apple.com/us/app/appname/id" +
      appleId +
      "?action=write-review";
    console.log("google_link", google_link);
    const google_link_image =
      '<br /><img src="https://img.techpowerup.org/200617/googlemap.png" alt="Google Map" height=100 width=100 /><p>Google</p><br /><button><a href=' +
      google_link +
      ">Review</a></button>";

    const apple_link_image =
      '<br /><img src="https://img.techpowerup.org/200623/apple.png" alt="Apple" height=100 width=100 /><p>Apple</p><br /><button><a href=' +
      apple_link +
      ">Review</a></button>";

    message_content =
      '<div style="background-color: lightgrey;padding: 25px;margin: 20px;"><div style="background-color: white;padding: 25px;margin: 20px;"><p>Hi,</p><b>' +
      email_heading +
      "</b></div><br /><div background-color: white;padding: 25px;margin: 20px;><p>" +
      email_content +
      "</p>";

    if (review_by_google && review_by_apple) {
      message_content += google_link_image + apple_link_image;
    } else if (review_by_google) {
      message_content += google_link_image;
    } else if (review_by_apple) {
      message_content += apple_link_image;
    }
    message_content +=
      additional_link_image1 + additional_link_image2 + "</div></div>";

    const email_sending_data = {
      subject: email_subject,
      message_content,
      emails
    };

    console.log("email_sending_data", email_sending_data);

    Axios.post(
      "https://cors-anywhere.herokuapp.com/https://dashify.biz/account/send_email",
      email_sending_data,
      DjangoConfig
    )
      .then(resp => {
        console.log("Email sended", resp);
      })
      .catch(resp => {
        console.log("email sending error", resp);
      });
  };

  changeHandler = event => {
    console.log("states", this.state);
    this.setState({ [event.target.name]: event.target.value });
  };

  check_email_or_phone = event => {
    let email_error = false;
    let phone_error = false;

    this.setState({ email_replyto_error: "" });

    this.setState({ [event.target.name]: event.target.value });

    var email = event.target.value,
      emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailReg.test(email) || email == "") {
      email_error = true;
    }

    //validate phone
    var phone = event.target.value,
      intRegex = /[0-9 -()+]+$/;
    if (phone.length < 6 || !intRegex.test(phone)) {
      phone_error = true;
    }
    if (phone_error && email_error) {
      this.setState({ email_replyto_error: "Invalid email / Phone No." });
    }

    console.log(
      "email_error phone_error email_replyto",
      email_error,
      phone_error,
      event.target.value
    );
  };

  add_fname = () => {
    var fname = [];
    for (let i = 0; i < this.state.add_customer; i++) {
      fname.push(
        <input
          type="text"
          className="form-control mt-30"
          placeholder="Enter First Name"
        />
      );
    }
    console.log(fname);
    return fname;
  };

  add_lname = () => {
    var lname = [];
    for (let i = 0; i < this.state.add_customer; i++) {
      lname.push(
        <input
          type="text"
          className="form-control mt-30"
          placeholder="Enter First Name"
        />
      );
    }
    console.log(lname);
    return lname;
  };

  add_phone = () => {
    var phone = [];
    for (let i = 0; i < this.state.add_customer; i++) {
      phone.push(
        <input
          type="email"
          className="form-control mt-30"
          placeholder="Enter Phone No."
          readonly
        />
      );
    }

    console.log(phone);
    return phone;
  };

  add_email = () => {
    var email = [];
    for (let i = 0; i < this.state.add_customer; i++) {
      email.push(
        <div>
          <input
            type="text"
            className="form-control mt-30"
            placeholder="Enter Email Address"
            name={i}
            onChange={this.customer_email_function}
            value={this.state.email_sendto_email[i]}
            required
          />
          <div style={{ color: "red" }}>{this.state.email_sendto_error[i]}</div>
        </div>
      );
    }
    console.log(email);
    return email;
  };

  customer_email_function = event => {
    event.persist();

    this.setState(prevState => ({
      email_sendto_error: {
        ...prevState.email_sendto_error,
        [event.target.name]: ""
      }
    }));

    var email = event.target.value,
      emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailReg.test(email) || email == "") {
      this.setState(prevState => ({
        email_sendto_error: {
          ...prevState.email_sendto_error,
          [event.target.name]: "Invalid Email"
        }
      }));
    }

    this.setState(prevState => ({
      email_sendto_email: {
        ...prevState.email_sendto_email,
        [event.target.name]: event.target.value
      }
    }));
    console.log("state", this.state);
  };

  add_customer_function = event => {
    event.preventDefault();
    console.log("add customer button clicked");
    this.setState({ add_customer: this.state.add_customer + 1 });
  };

  render() {
    const {
      cmapign_name,
      email_sendto_error,
      email_sendto_name,
      email_sendto_email,
      add_customer
    } = this.state;

    return (
      <div>
        <div className="main_content">
          <form
            className="needs-validation"
            onSubmit={this.submitHandler}
            noValidate
          >
            <div className="rightside_title">
              <h1>Enter campaign details</h1>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="step2">
                  <ul>
                    <li>
                    <div className="step-sms">
                      <a href="#">Step 02</a><span>Ralting Email And SMS</span>
                      </div>
                      <div className="closebox"><i className="zmdi zmdi-close"></i> Close section</div>
                    </li>
                  </ul>
                 

                  <div className="formbox">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>From Email</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="mohit.chack@digimonk.in"
                            readonly
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Customer first name</label>
                          {this.add_fname()}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Customer last name</label>
                          {this.add_lname()}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group">
                          <label>Customer Email/Phone number</label>
                          {/* <input
                          type="text"
                          className="form-control"
                          onChange={this.check_email_or_phone}
                          value={email_replyto}
                          name="email_replyto"
                          placeholder="customerone12@gmail.com"
                        />
                        <div style={{ color: "red" }}>
                          {this.state.email_replyto_error}
                        </div> */}
                          {this.add_email()}
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-group text-right">
                          <button
                            onClick={this.add_customer_function}
                            className="add_button"
                          >
                             Add
                            another Customer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                

                <div className="mt-30">
                  <div className="">
                    <div className="row">
                      <div className="col-md-5 col-md-offset-1">
                        <button className="gen_btn">
                          Create a new review generation
                        </button>
                      </div>
                      <div className="col-md-5">
                        <button type="submit" className="lunch_btn">
                          Launch Campaign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
              <div className="step2 topspace">
                  <div className="formbox">
                    <div className="design-ui">
                    <h3>
                    Upload Your CSV containing Customer Email / Phone Numbers
                        </h3>
                      <div className="csv">
                        <img src={require("../images/csv.png")} alt="csv" />
                      </div>
                      <div className="csv-text">
                        <button className="download_btn">
                          Download Simple
                        </button>
                        <div className="uploadbox">
                          <button className="upload_btn">Upload CSV</button>
                          <input type="file" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
