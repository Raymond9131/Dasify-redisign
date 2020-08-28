import React, { Component } from "react";
import Axios from "axios";
import {
  business_categories,
  location_by_id,
  edit_location_by_id,
  edit_location_operations_hours_by_id,
  edit_location_payment_by_id,
  update_images_by_location_id,
  add_other_images_by_location_id
} from "./apis/location";
import Spinner from "./common/Spinner";
import Loader from "react-loader-spinner";

// const GoogleConfig={
//     headers:{'Authorization':'Bearer '+localStorage.getItem("googleToken")},

//   }

const DjangoConfig = {
  headers: { Authorization: "Token " + localStorage.getItem("UserToken") }
};

export default class LocationManager extends Component {
  state = {
    location: [],
    name: "",
    storeCode: "",
    category: "",
    address: "",
    website: "",
    phone: "",
    hours: [],
    about: "",
    ownerName: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    ownerEmail: "",
    yearOfIncorp: "",
    businessTagline: "",
    instagramProfile: "",
    twitterProfile: "",
    facebookProfile: "",
    payment: [],
    loader: true,

    detailEdit: false,
    paymentEdit: false,
    hourEdit: false,

    visa: false,
    maestro: false,
    discover: false,
    cirrus: false,

    monday: "",
    mondayStart1: "",
    mondayEnd1: "",
    mondayStart2: "",
    mondayEnd2: "",

    tuesday: "",
    tuesdayStart1: "",
    tuesdayEnd1: "",
    tuesdayStart2: "",
    tuesdayEnd2: "",

    wednesday: "",
    wednesdayStart1: "",
    wednesdayEnd1: "",
    wednesdayStart2: "",
    wednesdayEnd2: "",

    thursday: "",
    thursdayStart1: "",
    thursdayEnd1: "",
    thursdayStart2: "",
    thursdayEnd2: "",

    friday: "",
    fridayStart1: "",
    fridayEnd1: "",
    fridayStart2: "",
    fridayEnd2: "",

    saturday: "",
    saturdayStart1: "",
    saturdayEnd1: "",
    saturdayStart2: "",
    saturdayEnd2: "",

    sunday: "",
    sundayStart1: "",
    sundayEnd1: "",
    sundayStart2: "",
    sundayEnd2: "",

    monday_s: "",
    monday_day_s: "",
    mondayStart1_s: "",
    mondayEnd1_s: "",
    mondayStart2_s: "",
    mondayEnd2_s: "",
    add_special_hour: false,
    special_hour_data: {},

    LocationDetails: "",
    otherImageLength: [0, 1, 2, 3, 4, 5, 6, 7],
    otherImage: "",
    otherImages: [],
    specialTimeLoading: false,
    otherImagesLoading: false,
    businessDetailsLoading: false,
    paymentLoading: false,
    operatingHoursLoading: false,
    logoLoading: false,
    coverImageLoading: false
  };

  componentDidMount = async () => {
    await this.loading_location_details();
  };

  loading_location_details = () => {
    var locationId = this.props.match.params.locationId;
    const data = {
      location_id: locationId
    };
    // Axios.post(
    //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/get-location-by-id",
    //   data,
    //   DjangoConfig
    // )
    location_by_id(data,DjangoConfig).then(resp => {
      console.log(resp.data);
      this.setState({
        location: resp.data.location,
        name: resp.data.location.Location_name,
        storeCode: resp.data.location.Store_Code,
        category: "Loading.....",
        address: resp.data.location.Address_1,
        website: resp.data.location.Website,
        phone: resp.data.location.Phone_no,
        hours: resp.data.location.Df_location_poen_hour,
        about: resp.data.location.About_Business,
        ownerName: resp.data.location.Business_Owner_Name,
        addressLine: resp.data.location,
        city: resp.data.location.City,
        state: resp.data.location.State,
        postalCode: resp.data.location.Zipcode,
        ownerEmail: resp.data.location.Owner_Email,
        yearOfIncorp: resp.data.location.Year_Of_Incorporation,
        businessTagline: resp.data.location.Business_Tagline,
        instagramProfile: resp.data.location.Instagram_Profile,
        twitterProfile: resp.data.location.Twitter_Profile,
        facebookProfile: resp.data.location.Facebook_Profile,
        payment: resp.data.location.Df_location_payments,
        LocationDetails: resp.data.location,
        otherImages: resp.data.location.Df_location_image,
        loader: false
      });
      // Axios.get(
      //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/dropdown-values/business-categoryes",
      //   DjangoConfig
      // )
      business_categories(DjangoConfig).then(resp1 => {
        resp1.data.BusinessCategory.map((b, i) =>
          b.id == resp.data.location.Business_category
            ? this.setState({ category: b.Category_Name })
            : ""
        );
      });
    });
  };

  editDetailsButton = event => {
    console.log("bu");
    this.setState({ detailEdit: true });
  };

  editPaymentButton = event => {
    console.log("pa");
    this.setState({ paymentEdit: true });
  };

  editHourButton = event => {
    console.log("hr");
    this.setState({ hourEdit: true });
  };

  updateDetailsButton = event => {
    event.preventDefault();
    console.log("bu");
    var locationId = this.props.match.params.locationId;

    const data = {
      Location_id: locationId,
      Business_Owner_Name: this.state.ownerName,
      Owner_Email: this.state.ownerEmail,
      Business_Tagline: this.state.businessTagline,
      Year_Of_Incorporation: this.state.yearOfIncorp,
      About_Business: this.state.about,
      Facebook_Profile: this.state.facebookProfile,
      Instagram_Profile: this.state.instagramProfile,
      Twitter_Profile: this.state.twitterProfile
    };

    this.setState({ businessDetailsLoading: true });

    // Axios.post(
    //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/edit-Location-Business-by-id",
    //   data,
    //   DjangoConfig
    // )
    edit_location_by_id(data,DjangoConfig).then(resp => {
        console.log(resp);

        this.setState({ detailEdit: false, businessDetailsLoading: false });
      })
      .catch(resp => {
        console.log(resp);
        this.setState({ businessDetailsLoading: false });
      });
  };

  updatePaymentButton = event => {
    event.preventDefault();
    console.log("pa");
    var locationId = this.props.match.params.locationId;

    var payment = {},
      i = 0;

    if (this.state.visa) {
      payment["" + i] = "Visa";
      i++;
    }
    if (this.state.cirrus) {
      payment["" + i] = "Cirrus";
      i++;
    }
    if (this.state.maestro) {
      payment["" + i] = "Maestro";
      i++;
    }
    if (this.state.discover) {
      payment["" + i] = "DiscoverNetwork";
      i++;
    }
    if (this.state.americanExpress) {
      payment["" + i] = "AmericanExpress";
      i++;
    }

    const data = {
      Location_id: locationId,
      payment_method: payment
    };
    const data2 = {
      Location_id: locationId
    };
    console.log(data);

    this.setState({ paymentLoading: true });

    // Axios.post(
    //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/edit-Location-payment-method-by-id",
    //   data,
    //   DjangoConfig
    // )
    edit_location_payment_by_id(data,DjangoConfig).then(resp => {
        console.log(resp);
        this.setState({ paymentEdit: false });
        const data1 = {
          location_id: locationId
        };
        // Axios.post(
        //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/get-location-by-id",
        //   data1,
        //   DjangoConfig
        // )
        location_by_id(data1,DjangoConfig).then(resp1 => {
            this.setState({
              payment: resp1.data.location.Df_location_payments,
              paymentLoading: false
            });
          })
          .catch(resp1 => {
            console.log(resp1);
            this.setState({
              paymentLoading: false
            });
          });
      })
      .catch(resp => {
        console.log(resp);
      });
  };

  updateHourButton = event => {
    event.preventDefault();
    console.log("hr");

    this.setState({ operatingHoursLoading: true });

    var locationId = this.props.match.params.locationId;

    const data = {
      Location_id: locationId,
      open_houre: {
        "0": {
          date: "",
          Day: "Monday",
          Type: "Regular",
          Open_status: this.state.monday,
          start_time_1: this.state.mondayStart1,
          end_time_1: this.state.mondayEnd1,
          start_time_2: this.state.mondayStart2,
          end_time_2: this.state.mondayEnd2
        },
        "1": {
          date: "",
          Day: "Tuesday",
          Type: "Regular",
          Open_status: this.state.tuesday,
          start_time_1: this.state.tuesdayStart1,
          end_time_1: this.state.tuesdayEnd1,
          start_time_2: this.state.tuesdayStart2,
          end_time_2: this.state.tuesdayEnd2
        },
        "2": {
          date: "",
          Day: "Wednesday",
          Type: "Regular",
          Open_status: this.state.wednesday,
          start_time_1: this.state.wednesdayStart1,
          end_time_1: this.state.wednesdayEnd1,
          start_time_2: this.state.wednesdayStart2,
          end_time_2: this.state.wednesdayEnd2
        },
        "3": {
          date: "",
          Day: "Thursday",
          Type: "Regular",
          Open_status: this.state.thursday,
          start_time_1: this.state.thursdayStart1,
          end_time_1: this.state.thursdayEnd1,
          start_time_2: this.state.thursdayStart2,
          end_time_2: this.state.thursdayEnd2
        },
        "4": {
          date: "",
          Day: "Friday",
          Type: "Regular",
          Open_status: this.state.friday,
          start_time_1: this.state.fridayStart1,
          end_time_1: this.state.fridayEnd1,
          start_time_2: this.state.fridayStart2,
          end_time_2: this.state.fridayEnd2
        },
        "5": {
          date: "",
          Day: "Saturday",
          Type: "Regular",
          Open_status: this.state.saturday,
          start_time_1: this.state.saturdayStart1,
          end_time_1: this.state.saturdayEnd1,
          start_time_2: this.state.saturdayStart2,
          end_time_2: this.state.saturdayEnd2
        },
        "6": {
          date: "",
          Day: "Sunday",
          Type: "Regular",
          Open_status: this.state.sunday,
          start_time_1: this.state.sundayStart1,
          end_time_1: this.state.sundayEnd1,
          start_time_2: this.state.sundayStart2,
          end_time_2: this.state.sundayEnd2
        }
      }
    };

    // Axios.post(
    //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/edit-Location-operations-hours-by-id",
    //   data,
    //   DjangoConfig
    // )
    edit_location_operations_hours_by_id(data,DjangoConfig).then(resp => {
        console.log(resp);
        this.setState({ hourEdit: false });
        // window.location.reload(false);

        const data1 = {
          location_id: locationId
        };
        // Axios.post(
        //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/get-location-by-id",
        //   data1,
        //   DjangoConfig
        // )
        location_by_id(data1,DjangoConfig).then(resp1 => {
            this.setState({
              hours: resp1.data.location.Df_location_poen_hour,
              operatingHoursLoading: false
            });
          })
          .catch(resp1 => {
            console.log(resp1);
            this.setState({
              operatingHoursLoading: false
            });
          });
      })
      .catch(resp => {
        console.log(resp);
        this.setState({
          operatingHoursLoading: false
        });
      });
  };

  editSpecialHourButton = event => {
    console.log("hr");
    this.setState({ add_special_hour: true });
  };

  // addSpecialHourButton = () => {
  // console.log("open hours",this.state.LocationDetails.Df_location_poen_hour)
  // }

  addSpecialHourButton = async event => {
    event.preventDefault();

    // this.setState(prevState => ({
    //   special_hour_data: {
    //     ...prevState.special_hour_data,
    //     [name]: event.target.value
    //   }
    // }));
    let i = 0;
    let i2 = this.state.LocationDetails.Df_location_poen_hour.length - 7;
    console.log("monday", this.state.monday_day_s, i);

    if (this.state.monday_day_s) {
      await this.setState(prevState => ({
        special_hour_data: {
          ...prevState.special_hour_data,
          [i]: {
            date: this.state.monday_day_s,
            Day: "Special",
            Type: `Special-${i2}`,
            Open_status: this.state.monday_s,
            start_time_1: this.state.mondayStart1_s,
            end_time_1: this.state.mondayEnd1_s,
            start_time_2: this.state.mondayStart2_s,
            end_time_2: this.state.mondayEnd2_s
          }
        }
      }));
      i++;
    }

    this.addSpecialHourToDb();
    // this.test();
  };

  test = () => {
    console.log("special", JSON.stringify(this.state.special_hour_data));
  };

  addSpecialHourToDb = () => {
    // event.preventDefault();
    console.log("special");
    var locationId = this.props.match.params.locationId;

    const data = {
      Location_id: locationId,
      open_houre: this.state.special_hour_data
    };

    this.setState({ specialTimeLoading: true });

    // Axios.post(
    //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/edit-Location-operations-hours-by-id",
    //   data,
    //   DjangoConfig
    // )
    edit_location_operations_hours_by_id(data,DjangoConfig).then(resp => {
        console.log(resp);
        this.setState({ add_special_hour: false });

        const data1 = {
          location_id: locationId
        };
        // Axios.post(
        //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/get-location-by-id",
        //   data1,
        //   DjangoConfig
        // )
        location_by_id(data1,DjangoConfig).then(resp1 => {
            this.setState({
              hours: resp1.data.location.Df_location_poen_hour,
              specialTimeLoading: false
            });
          })
          .catch(resp1 => {
            console.log(resp1);
            this.setState({ specialTimeLoading: false });
          });
      })
      .catch(resp => {
        console.log(resp);
      });
  };

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  checkBoxHandler = event => {
    console.log(event.target.checked);
    if (event.target.checked) {
      this.setState({ [event.target.name]: true });
    } else {
      this.setState({ [event.target.name]: false });
    }
  };

  onUploadLogo = name => event => {
    if (name == "Business_Logo") {
      this.setState({ logoLoading: true });
    }
    if (name == "Business_Cover_Image") {
      this.setState({ coverImageLoading: true });
    }
    let files = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = e => {
      //   console.log(e.target.result);
      //   this.setState({ BusinessLogoUpdate: e.target.result });

      var locationId = this.props.match.params.locationId;

      const data = {
        location_id: locationId,
        [name]: e.target.result
      };

      // Axios.post(
      //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/update-images-files-by-location-id",
      //   data,
      //   DjangoConfig
      // )
      update_images_by_location_id(data,DjangoConfig).then(resp => {
          const data1 = {
            location_id: locationId
          };
          // Axios.post(
          //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/get-location-by-id",
          //   data1,
          //   DjangoConfig
          // )
          location_by_id(data1,DjangoConfig).then(resp1 => {
              this.setState({
                LocationDetails: resp1.data.location,
                logoLoading: false,
                coverImageLoading: false
              });
            })
            .catch(resp1 => {
              console.log(resp1);
              this.setState({ logoLoading: false, coverImageLoading: false });
            });
        })
        .catch(resp => {
          console.log(resp);
          this.setState({ logoLoading: false, coverImageLoading: false });
        });
    };
  };

  onUploadOtherImage = event => {
    let files = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = e => {
      //   console.log(e.target.result);
      //   this.setState({ BusinessLogoUpdate: e.target.result });

      var locationId = this.props.match.params.locationId;

      const data = {
        location_id: locationId,
        other_image: { 0: e.target.result }
      };

      this.setState({ otherImagesLoading: true });

      // Axios.post(
      //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/add-other-images-files-by-location-id",
      //   data,
      //   DjangoConfig
      // )
      add_other_images_by_location_id(data,DjangoConfig).then(resp => {
          const data1 = {
            location_id: locationId
          };
          // Axios.post(
          //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/get-location-by-id",
          //   data1,
          //   DjangoConfig
          // )
          location_by_id(data1,DjangoConfig).then(resp1 => {
              this.setState({
                otherImages: resp1.data.location.Df_location_image,
                otherImagesLoading: false
              });
            })
            .catch(resp1 => {
              console.log(resp1);
              this.setState({ otherImagesLoading: false });
            });
        })
        .catch(resp => {
          console.log(resp);
          this.setState({ otherImagesLoading: false });
        });
    };
  };

  render() {
    console.log(this.state);

    localStorage.setItem("locationId", this.props.match.params.locationId);

    var RegularHours1;
    RegularHours1 = (
      <div className="promotional-box">
        {this.state.hours.map(h =>
          h.Type == "Regular" ? (
            <div className="daybox" key={h.id}>
              <div className="daytype">{h.Day}</div>

              {h.Open_status == "SPLIT" ? (
                <div>
                  {h.start_time_1} - {h.end_time_1},{h.start_time_2} -{" "}
                  {h.end_time_2}
                </div>
              ) : (
                ""
              )}

              {h.Open_status == "OPEN" ? (
                <div>
                  From {h.start_time_1} to {h.end_time_1}
                </div>
              ) : (
                ""
              )}

              {h.Open_status == "OPEN 24x7" ? <div>OPEN 24x7</div> : ""}

              {h.Open_status == "CLOSED" ? <div>CLOSED</div> : ""}
            </div>
          ) : (
            ""
          )
        )}
      </div>
    );

    var RegularHours2;
    RegularHours2 = (
      <div className="promotional-box">
        {this.state.hours.map(h =>
          h.Day == "Special" ? (
            <div className="daybox" key={h.id}>
              {/* <div className="daytype">{h.Day}</div> */}
              <div className="daytype">
                {h.date
                  .split("-")
                  .reverse()
                  .join("-")}
              </div>

              {h.Open_status == "SPLIT" ? (
                <div>
                  {h.start_time_1} - {h.end_time_1},{h.start_time_2} -{" "}
                  {h.end_time_2}
                </div>
              ) : (
                ""
              )}

              {h.Open_status == "OPEN" ? (
                <div>
                  From {h.start_time_1} to {h.end_time_1}
                </div>
              ) : (
                ""
              )}

              {h.Open_status == "OPEN 24x7" ? <div>OPEN 24x7</div> : ""}

              {h.Open_status == "CLOSED" ? <div>CLOSED</div> : ""}
            </div>
          ) : (
            ""
          )
        )}
      </div>
    );

    var paymentAccepted;

    paymentAccepted = this.state.payment.map(p => (
      <li key={p.id}>
       
          {p.Payment_Method == "Visa" ? (
            
              <img src={require("../images/visa.jpg")} alt="visa" />
            
          ) : (
            ""
          )}
          {p.Payment_Method == "Maestro" ? (
            
              <img src={require("../images/master-1.jpg")} alt="master" />
           
          ) : (
            ""
          )}
          {p.Payment_Method == "DiscoverNetwork" ? (
            
              <img src={require("../images/descover.jpg")} alt="discover" />
           
          ) : (
            ""
          )}
          {p.Payment_Method == "Cirrus" ? (
            
              <img src={require("../images/cirrus.jpg")} alt="cirrus" />
           
          ) : (
            ""
          )}
          {p.Payment_Method == "AmericanExpress" ? (
            
              <img src={require("../images/am.jpg")} alt="amex" />
            
          ) : (
            ""
          )}
       
      </li>
    ));

    let { LocationDetails } = this.state;
    // let a = this.state.LocationDetails.Df_location_image.map(
    //   (img, i) => img.Image
    // );

    return (
      <div>
        {/* <div className="content-page"> */}

        {this.state.loader ? 
        <div className="rightside_title">
         <Spinner />
         </div> :
        <div className="main_content">
          <div className="rightside_title">
            <h1>Business Information</h1>
          </div>

          <div className="mt-30">
            <div className="">
              <div className="row">
                <div className="col-md-4">
                  <div className="white-shadow">
                    <div className="logo-business">
                      <h2 className="analytics_btnx">Brothers LLC 
                      <button className="last_btn">Edit</button></h2>
                    {this.state.logoLoading ? (
                      <div style={{ textAlign: "center" }}>
                        <Loader
                          type="Oval"
                          color="#00BFFF"
                          height={30}
                          width={30}
                          // timeout={3000} //3 secs
                        />
                      </div>
                      
                    ) : LocationDetails.Business_Logo ? (
                      <div className="uploadphoto pt-15">
                      <img src={LocationDetails.Business_Logo} alt="Logo" />
                      </div>
                    ) : (
                     
                      <div className="uploadphoto pt-15">
                        <div>
                        <i className="zmdi zmdi-cloud-upload"></i>
                        <h3>Upload logo</h3>
                        <input
                          type="file"
                          name="Business_Logo"
                          onChange={this.onUploadLogo("Business_Logo")}
                        />
                        </div>
                      </div>
                      )}


<div className="detailbox">
<div className="uploadauthor">
                      <div className="author_namebox">Store Code :</div>
                      <div className="storetext">{this.state.storeCode}</div>
                    </div>

                    <div className="uploadauthor">
                      <div className="author_namebox">Category :</div>
                      <div className="storetext">{this.state.category}</div>
                    </div>

                    <div className="uploadauthor">
                      <div className="author_namebox">Address :</div>
                      <div className="storetext">
                        {" "}
                        {this.state.city}, {this.state.state}{" "}
                        {this.state.postalCode}
                      </div>
                    </div>
                    <div className="uploadauthor">
                      <div className="author_namebox">Phone :</div>
                      <div className="storetext">{this.state.phone}</div>
                    </div>

                    <div className="uploadauthor">
                      <div className="author_namebox">Website :</div>
                      <div className="storetext">{this.state.website}</div>
                    </div>


</div>

                    
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="upload_text white-shadow">
                   
                    <h2 className="analytics_btnx">{this.state.name} 
                      <button className="last_btn">Edit</button></h2>
<div className="pt-15">
  <h3>About the business</h3>
  <p>Business vocabulary and commonly used phrases are also detailed in the texts,
     and all this information - including the texts themselves, the vocabulary, 
     and the questions - can be downloaded for free. Business vocabulary and commonly used
     phrases are also detailed in the texts, and all this.</p>
<div className="detailbox">
                    <div className="uploadauthor">
                      <div className="author_namebox">Store Code :</div>
                      <div className="storetext">{this.state.storeCode}</div>
                    </div>

                    <div className="uploadauthor">
                      <div className="author_namebox">Category :</div>
                      <div className="storetext">{this.state.category}</div>
                    </div>

                    <div className="uploadauthor">
                      <div className="author_namebox">Address :</div>
                      <div className="storetext">
                        {" "}
                        {this.state.city}, {this.state.state}{" "}
                        {this.state.postalCode}
                      </div>
                    </div>
                    <div className="uploadauthor">
                      <div className="author_namebox">Phone :</div>
                      <div className="storetext">{this.state.phone}</div>
                    </div>

                    <div className="uploadauthor">
                      <div className="author_namebox">Website :</div>
                      <div className="storetext">{this.state.website}</div>
                    </div>
                  </div>
                  <ul className="socialicon-new">
                    <li><a href="#"><img src={require('../images/icon-1.png')} alt=""/></a></li>
                    <li><a href="#"><img src={require('../images/icon-2.png')} alt=""/></a></li>
                    <li><a href="#"><img src={require('../images/icon-3.png')} alt=""/></a></li>
                    <li><a href="#"><img src={require('../images/icon-4.png')} alt=""/></a></li>

                  </ul>
                  </div>
                  </div>
                </div>

                
<div className="col-md-4">
                {this.state.operatingHoursLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Loader
                      type="Oval"
                      color="#00BFFF"
                      height={30}
                      width={30}
                      // timeout={3000} //3 secs
                    />
                  </div>
                ) : this.state.hourEdit ? (
                  <div className="form-group">
                    <div className="timebox">
                      <div className="form-day">MONDAY</div>
                      <select
                        name="monday"
                        onChange={this.changeHandler}
                        className="form-control colorselector"
                      >
                        <option>Select hours</option>
                        <option value="OPEN">OPEN</option>
                        <option value="SPLIT">SPLIT</option>
                        <option value="OPEN 24x7">OPEN_24x7</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="output">
                        {this.state.monday == "OPEN" ? (
                          <div>
                            <p className="basicExample">
                              {console.log("time")}

                              <input
                                name="mondayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="mondayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>{" "}
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.monday == "SPLIT" ? (
                          <div>
                            <p className="basicExample">
                              <input
                                name="mondayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="mondayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="mondayStart2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="mondayEnd2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="timebox">
                      <div className="form-day">TUESDAY </div>
                      <select
                        name="tuesday"
                        onChange={this.changeHandler}
                        className="form-control colorselector"
                      >
                        <option>Select hours</option>
                        <option value="OPEN">OPEN</option>
                        <option value="SPLIT">SPLIT</option>
                        <option value="OPEN 24x7">OPEN_24x7</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="output">
                        {this.state.tuesday == "OPEN" ? (
                          <div>
                            <p className="basicExample">
                              {console.log("time")}

                              <input
                                name="tuesdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="tuesdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>{" "}
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.tuesday == "SPLIT" ? (
                          <div>
                            <p className="basicExample">
                              <input
                                name="tuesdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="tuesdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="tuesdayStart2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="tuesdayEnd2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="timebox">
                      <div className="form-day">WEDNESDAY</div>
                      <select
                        name="wednesday"
                        onChange={this.changeHandler}
                        className="form-control colorselector"
                      >
                        <option>Select hours</option>
                        <option value="OPEN">OPEN</option>
                        <option value="SPLIT">SPLIT</option>
                        <option value="OPEN 24x7">OPEN_24x7</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="output">
                        {this.state.wednesday == "OPEN" ? (
                          <div>
                            <p className="basicExample">
                              {console.log("time")}

                              <input
                                name="wednesdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="wednesdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>{" "}
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.wednesday == "SPLIT" ? (
                          <div>
                            <p className="basicExample">
                              <input
                                name="wednesdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="wednesdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="wednesdayStart2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="wednesdayEnd2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="timebox">
                      <div className="form-day"> THURSDAY</div>
                      <select
                        name="thursday"
                        onChange={this.changeHandler}
                        className="form-control colorselector"
                      >
                        <option>Select hours</option>
                        <option value="OPEN">OPEN</option>
                        <option value="SPLIT">SPLIT</option>
                        <option value="OPEN 24x7">OPEN_24x7</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="output">
                        {this.state.thursday == "OPEN" ? (
                          <div>
                            <p className="basicExample">
                              {console.log("time")}

                              <input
                                name="thursdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="thursdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>{" "}
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.thursday == "SPLIT" ? (
                          <div>
                            <p className="basicExample">
                              <input
                                name="thursdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="thursdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="thursdayStart2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="thursdayEnd2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="timebox">
                      <div className="form-day"> FRIDAY</div>
                      <select
                        name="friday"
                        onChange={this.changeHandler}
                        className="form-control colorselector"
                      >
                        <option>Select hours</option>
                        <option value="OPEN">OPEN</option>
                        <option value="SPLIT">SPLIT</option>
                        <option value="OPEN 24x7">OPEN_24x7</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="output">
                        {this.state.friday == "OPEN" ? (
                          <div>
                            <p className="basicExample">
                              {console.log("time")}

                              <input
                                name="fridayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="fridayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>{" "}
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.friday == "SPLIT" ? (
                          <div>
                            <p className="basicExample">
                              <input
                                name="fridayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="fridayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="fridayStart2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="fridayEnd2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="timebox">
                      <div className="form-day">SATURDAY</div>
                      <select
                        name="saturday"
                        onChange={this.changeHandler}
                        className="form-control colorselector"
                      >
                        <option>Select hours</option>
                        <option value="OPEN">OPEN</option>
                        <option value="SPLIT">SPLIT</option>
                        <option value="OPEN 24x7">OPEN_24x7</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="output">
                        {this.state.saturday == "OPEN" ? (
                          <div>
                            <p className="basicExample">
                              {console.log("time")}

                              <input
                                name="saturdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="saturdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>{" "}
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.saturday == "SPLIT" ? (
                          <div>
                            <p className="basicExample">
                              <input
                                name="saturdayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="saturdayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="saturdayStart2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="saturdayEnd2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="timebox">
                      <div className="form-day">SUNDAY</div>
                      <select
                        name="sunday"
                        onChange={this.changeHandler}
                        className="form-control colorselector"
                      >
                        <option>Select hours</option>
                        <option value="OPEN">OPEN</option>
                        <option value="SPLIT">SPLIT</option>
                        <option value="OPEN 24x7">OPEN_24x7</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>

                      <div className="output">
                        {this.state.sunday == "OPEN" ? (
                          <div>
                            <p className="basicExample">
                              {console.log("time")}

                              <input
                                name="sundayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="sundayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>{" "}
                          </div>
                        ) : (
                          ""
                        )}

                        {this.state.sunday == "SPLIT" ? (
                          <div>
                            <p className="basicExample">
                              <input
                                name="sundayStart1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="sundayEnd1"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="sundayStart2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time form-control "
                                defaultValue="12:00 AM"
                              />

                              <input
                                name="sundayEnd2"
                                onChange={this.changeHandler}
                                type="time"
                                className="time end form-control "
                                defaultValue="12:00 AM"
                              />
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="business-cover text-center">
                      <button
                        type="submit"
                        className="last_btn"
                        onClick={this.updateHourButton}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="analytics-whice white-shadow">
                    <div className="box-space">
                      <h2 className="analytics_btnx">
                        Operations Hours
                        <button
                          className="last_btn"
                          onClick={this.editHourButton}
                        >
                           Edit
                        </button>{" "}
                      </h2>
                    </div>

                    {RegularHours1}

                    <div className="add-a-spacial">
                    <a href="#">Add a special Hour</a>
                  </div>

                  </div>
                )}

                {/* Add special hour */}

                {/*<div className="analytics-whice mt-30">
                  <div className="add-a-spacial">
                    <a href="#">Add a special Hour</a>
                  </div>

                  {this.state.specialTimeLoading ? (
                    <div style={{ textAlign: "center" }}>
                      <Loader
                        type="Oval"
                        color="#00BFFF"
                        height={30}
                        width={30}
                        // timeout={3000} //3 secs
                      />
                    </div>
                  ) : this.state.add_special_hour ? (
                    <div className="form-group">
                      <div className="timebox">
                        

                        <select
                          name="monday_s"
                          onChange={this.changeHandler}
                          className="form-control colorselector"
                        >
                          <option>Select hours</option>
                          <option value="OPEN">OPEN</option>
                          <option value="SPLIT">SPLIT</option>
                          <option value="OPEN 24x7">OPEN_24x7</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>

                        <div className="output">
                          {this.state.monday_s == "OPEN" ? (
                            <div>
                              <p className="basicExample">
                                {console.log("time")}

                                <input
                                  name="mondayStart1_s"
                                  onChange={this.changeHandler}
                                  type="time"
                                  className="time form-control "
                                  defaultValue="12:00 AM"
                                />

                                <input
                                  name="mondayEnd1_s"
                                  onChange={this.changeHandler}
                                  type="time"
                                  className="time end form-control "
                                  defaultValue="12:00 AM"
                                />
                              </p>{" "}
                            </div>
                          ) : (
                            ""
                          )}

                          {this.state.monday_s == "SPLIT" ? (
                            <div>
                              <p className="basicExample">
                                <input
                                  name="mondayStart1_s"
                                  onChange={this.changeHandler}
                                  type="time"
                                  className="time form-control "
                                  defaultValue="12:00 AM"
                                />

                                <input
                                  name="mondayEnd1_s"
                                  onChange={this.changeHandler}
                                  type="time"
                                  className="time end form-control "
                                  defaultValue="12:00 AM"
                                />

                                <input
                                  name="mondayStart2_s"
                                  onChange={this.changeHandler}
                                  type="time"
                                  className="time form-control "
                                  defaultValue="12:00 AM"
                                />

                                <input
                                  name="mondayEnd2_s"
                                  onChange={this.changeHandler}
                                  type="time"
                                  className="time end form-control "
                                  defaultValue="12:00 AM"
                                />
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                          <input
                            name="monday_day_s"
                            onChange={this.changeHandler}
                            type="date"
                            className="time end form-control "
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="business-cover text-center">
                        <button
                          type="submit"
                          className="last_btn"
                          onClick={this.addSpecialHourButton}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="analytics-whice">
                      <div className="box-space">
                        <h2 className="analytics_btnx">
                          Special Time Opening
                          <button
                            className="last_btn"
                            onClick={this.editSpecialHourButton}
                          >
                            <i className="zmdi zmdi-edit"></i> Edit
                          </button>{" "}
                        </h2>
                      </div>

                      {RegularHours2}
                    </div>
                  )}

                  
                </div>*/}
                {/* ending of special hour */}
              </div>


              </div>
            </div>
          </div>

         {/*} <div className="mt-30">
            <div className="row">
              <div className="col-md-8">
                {this.state.businessDetailsLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Loader
                      type="Oval"
                      color="#00BFFF"
                      height={30}
                      width={30}
                      // timeout={3000} //3 secs
                    />
                  </div>
                ) : this.state.detailEdit ? (
                  <div className="row addlocationboxs">
                    <form onSubmit={this.editDetailsHandler}>
                      <div className="form-group">
                        <label>Business Owner Name</label>
                        <input
                          name="ownerName"
                          onChange={this.changeHandler}
                          type="text"
                          className="form-control"
                          id="ownerName"
                          placeholder="Enter Business Owner Name"
                          value={this.state.ownerName}
                        ></input>
                      </div>
                      <div className="form-group">
                        <label>Owner Email</label>
                        <input
                          name="ownerEmail"
                          onChange={this.changeHandler}
                          type="email"
                          className="form-control"
                          id="ownerEmail"
                          placeholder="Enter Owner Email"
                          value={this.state.ownerEmail}
                        ></input>
                      </div>

                      <div className="form-group">
                        <label>Business Tagline</label>
                        <input
                          name="businessTagline"
                          onChange={this.changeHandler}
                          className="form-control"
                          id="businessTagline"
                          placeholder="Enter Business Tagline"
                          value={this.state.businessTagline}
                        ></input>
                      </div>

                      <div className="form-group">
                        <label>Year of Incorporation</label>
                        <input
                          name="yearOfIncorp"
                          onChange={this.changeHandler}
                          type="text"
                          className="form-control"
                          id="yearOfIncorp"
                          placeholder="Enter Year of Incorporation"
                          value={this.state.yearOfIncorp}
                        ></input>
                      </div>

                      <div className="form-group">
                        <label>
                          About The Business <span>*</span>
                        </label>
                        <textarea
                          name="about"
                          onChange={this.changeHandler}
                          className="form-control businessh"
                          value={this.state.about}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label>Facebook Profile</label>
                        <input
                          name="facebookProfile"
                          onChange={this.changeHandler}
                          type="text"
                          className="form-control"
                          placeholder="Enter Facbook Profile"
                          value={this.state.facebookProfile}
                        />
                      </div>

                      <div className="form-group">
                        <label>Instagram Profile</label>
                        <input
                          name="instagramProfile"
                          onChange={this.changeHandler}
                          type="text"
                          className="form-control"
                          placeholder="Enter Instagram Profile"
                          value={this.state.instagramProfile}
                        />
                      </div>

                      <div className="form-group">
                        <label>Twitter Profile</label>
                        <input
                          name="twitterProfile"
                          onChange={this.changeHandler}
                          type="text"
                          className="form-control"
                          placeholder="Enter Twitter Profile"
                          value={this.state.twitterProfile}
                        />
                      </div>

                      <div className="business-cover text-center">
                        <button
                          type="submit"
                          className="last_btn"
                          onClick={this.updateDetailsButton}
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="analytics-whice">
                    <div className="box-space">
                      <h2 className="analytics_btnx">
                        Business Details
                        <button
                          className="last_btn"
                          onClick={this.editDetailsButton}
                        >
                          <i className="zmdi zmdi-edit"></i> Edit
                        </button>{" "}
                      </h2>
                    </div>
                    <div className="promotional-box border-bottom">
                      <div className="abouttext">
                        <h4>About the business</h4>
                        <p>{this.state.about}</p>
                      </div>
                    </div>

                    <div className="promotional-box border-bottom">
                      <div className="abouttext">
                        <p>
                          Bussiness owner name : <b>{this.state.ownerName}</b>
                        </p>
                        <p>
                          Owner email : <span>{this.state.ownerEmail}</span>
                        </p>
                        <p>
                          Bussiness tagline :{" "}
                          <span>{this.state.businessTagline}</span>
                        </p>
                        <p>
                          Year of incorporation :{" "}
                          <span>{this.state.yearOfIncorp}</span>
                        </p>
                      </div>
                    </div>

                    <div className="promotional-box">
                      <ul className="socailicon">
                       
                        <li>
                          <a href={this.state.facebookProfile}>
                            <img src={require("../images/facebook.png")} />
                          </a>
                        </li>
                        <li>
                          <a href={this.state.instagramProfile}>
                            <img src={require("../images/instagram.png")} />
                          </a>
                        </li>
                        <li>
                          <a href={this.state.twitterProfile}>
                            <img src={require("../images/twitter.png")} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="mt-30">
                  <div className="analytics-whice">
                    <div className="box-space">
                      <h2 className="analytics_btnx">
                        Payment Method
                        <button
                          className="last_btn"
                          onClick={this.editPaymentButton}
                        >
                          <i className="zmdi zmdi-edit"></i> Edit
                        </button>{" "}
                      </h2>
                    </div>

                    {this.state.paymentLoading ? (
                      <div style={{ textAlign: "center" }}>
                        <Loader
                          type="Oval"
                          color="#00BFFF"
                          height={30}
                          width={30}
                          // timeout={3000} //3 secs
                        />
                      </div>
                    ) : this.state.paymentEdit ? (
                      <div className="mathedbox">
                        <form onSubmit={this.editDetailsHandler}>
                          <div className="paymentbox">
                            <ul>
                              <li>
                                <input
                                  name="visa"
                                  type="checkbox"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                />{" "}
                                <img
                                  src={require("../images/visa.jpg")}
                                  alt="visa"
                                />
                              </li>

                              <li>
                                <input
                                  name="maestro"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/master-1.jpg")}
                                  alt="visa"
                                />
                              </li>
                              <li>
                                <input
                                  name="discover"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/descover.jpg")}
                                  alt="visa"
                                />
                              </li>
                              <li>
                                <input
                                  name="cirrus"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/cirrus.jpg")}
                                  alt="visa"
                                />
                              </li>
                              <li>
                                <input
                                  name="americanExpress"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/am.jpg")}
                                  alt="visa"
                                />
                              </li>
                            </ul>
                          </div>

                          <div className="business-cover text-center">
                            <button
                              type="submit"
                              className="last_btn"
                              onClick={this.updatePaymentButton}
                            >
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="paymentbox">
                        <ul>{paymentAccepted}</ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              
              
            </div>
          </div>*/}



<div className="mt-30">
                  <div className="light-blue">
                    <div className="box-space">
                      <h2 className="analytics_btnx">
                        Payment Method
                        <button
                          className="pay_last_btn"
                          onClick={this.editPaymentButton}
                        >
                          Edit
                        </button>{" "}
                      </h2>
                    </div>

                    {this.state.paymentLoading ? (
                      <div style={{ textAlign: "center" }}>
                        <Loader
                          type="Oval"
                          color="#00BFFF"
                          height={30}
                          width={30}
                          // timeout={3000} //3 secs
                        />
                      </div>
                    ) : this.state.paymentEdit ? (
                      <div className="mathedbox">
                        <form onSubmit={this.editDetailsHandler}>
                          <div className="paymentbox">
                            <ul>
                              <li>
                                <input
                                  name="visa"
                                  type="checkbox"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                />{" "}
                                <img
                                  src={require("../images/visa.jpg")}
                                  alt="visa"
                                />
                              </li>

                              <li>
                                <input
                                  name="maestro"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/master-1.jpg")}
                                  alt="visa"
                                />
                              </li>
                              <li>
                                <input
                                  name="discover"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/descover.jpg")}
                                  alt="visa"
                                />
                              </li>
                              <li>
                                <input
                                  name="cirrus"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/cirrus.jpg")}
                                  alt="visa"
                                />
                              </li>
                              <li>
                                <input
                                  name="americanExpress"
                                  onChange={this.checkBoxHandler}
                                  value="true"
                                  type="checkbox"
                                />{" "}
                                <img
                                  src={require("../images/am.jpg")}
                                  alt="visa"
                                />
                              </li>
                              <li className="plushbtnbox">
                              <a className="add_btnnew"><i className="zmdi zmdi-plus"></i></a>
                              </li>
                            </ul>
                          </div>

                          <div className="business-cover text-center">
                            <button
                              type="submit"
                              className="last_btn"
                              onClick={this.updatePaymentButton}
                            >
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="paymentbox">
                        <ul>{paymentAccepted} 
                        <li className="plushbtnbox">
                              <a className="add_btnnew"><i className="zmdi zmdi-plus"></i></a>
                              </li></ul>
                      </div>
                    )}
                  </div>
                  </div>



          <div className="mt-30">
            <div className="row">
              <div className="col-md-4">
                <div className="business-cover">
                  <h3>Business covers image</h3>
                  {/*<div className="coverimgupload">
                    {this.state.coverImageLoading ? (
                      <div style={{ textAlign: "center" }}>
                        <Loader
                          type="Oval"
                          color="#00BFFF"
                          height={30}
                          width={30}
                          // timeout={3000} //3 secs
                        />
                      </div>
                    ) : LocationDetails.Business_Cover_Image ? (
                      <img
                        src={LocationDetails.Business_Cover_Image}
                        alt="Cover image"
                      />
                    ) : (
                      <div className="coverocn">
                        <i className="zmdi zmdi-image"></i>
                        <h4>Attatch a image</h4>
                        <input
                          type="file"
                          name="Business_Cover_Image"
                          onChange={this.onUploadLogo("Business_Cover_Image")}
                        />
                      </div>
                    )}
                  </div>*/}
                  <div className="coverimgupload">
                    <img src={require('../images/b-1.jpg')} alt=""/>
                  </div>
                  <div className="plush_new">
                  <span><i className="zmdi zmdi-plus"></i>
                  Attatch a image
                  <input
                          type="file"
                          name="Business_Cover_Image"
                          />
                  </span>

                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="business-cover">
                  <h3>Starred Business covers image</h3>
                  <div className="row">
                    <div className="col-md-12">
                      <ul className="shared-business">
                        <li>
                          <img src={require('../images/sh-1.png')} alt=""/>
                        </li>
                        <li>
                          <img src={require('../images/sh-2.png')} alt=""/>
                        </li>
                        <li>
                          <img src={require('../images/sh-3.png')} alt=""/>
                        </li>
                        <li>
                          <img src={require('../images/sh-4.png')} alt=""/>
                        </li>
                        <li>
                          <img src={require('../images/sh-5.png')} alt=""/>
                        </li>
                      </ul>
                    </div>
                   {/* {this.state.otherImagesLoading ? (
                      <div style={{ textAlign: "center" }}>
                        <Loader
                          type="Oval"
                          color="#00BFFF"
                          height={30}
                          width={30}
                          // timeout={3000} //3 secs
                        />
                      </div>
                    ) : (
                      this.state.otherImageLength.map((n, i) =>
                        // console.log(
                        //   "image check",
                        //   this.state.otherImages[0] == undefined
                        //     ? "undefined"
                        //     : this.state.otherImages[0]
                        // )
                        this.state.otherImages[i] != undefined ? (
                          <div className="col-md-3">
                            <div className="imgup">
                              <img
                                height="100"
                                width="100"
                                src={this.state.otherImages[i].Image}
                                alt="Starred Business covers image"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="col-md-3">
                            <div className="staresd">
                              <div className="imgup">
                                <i className="zmdi zmdi-image"></i>
                                <input
                                  type="file"
                                  name="otherImage"
                                  onChange={this.onUploadOtherImage}
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )
                    )}*/}

                    {/* {LocationDetails.Df_location_image ? 
                    LocationDetails.Df_location_image.map((image, i) => (
                        <div className="col-md-3">
                      <div className="staresd"><div className="imgup">
                          <img
                            src={image.Image}
                            alt="Starred Business covers image"
                          />
                        </div></div>
                    </div>
                    )) : <div className="col-md-3">
                      <div className="staresd"><div className="imgup">
                    <i className="zmdi zmdi-image"></i>
                    <input type="file" />
                  </div></div>
                    </div>} */}

                    {/* <div className="col-md-3">
                      <div className="staresd">
                        <div className="imgup">
                          <i className="zmdi zmdi-image"></i>
                          <input type="file" />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="staresd">
                        <div className="imgup">
                          <i className="zmdi zmdi-image"></i>
                          <input type="file" />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="staresd">
                        <div className="imgup">
                          <i className="zmdi zmdi-image"></i>
                          <input type="file" />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="staresd">
                        <div className="imgup">
                          <i className="zmdi zmdi-image"></i>
                          <input type="file" />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="staresd">
                        <div className="imgup">
                          <i className="zmdi zmdi-image"></i>
                          <input type="file" />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="staresd">
                        <div className="imgup">
                          <i className="zmdi zmdi-image"></i>
                          <input type="file" />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="staresd">
                        <div className="imgup">
                          <i className="zmdi zmdi-image"></i>
                          <input type="file" />
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        }

        {/* </div> */}
      </div>
    );
  }
}
