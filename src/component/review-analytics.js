import React, { Component } from "react";
import Axios from "axios";
import { all_connection_of_one_location } from "./apis/social_platforms";
import Chart from "react-google-charts";
import Spinner from "./common/Spinner";

const Yelpconfig = {
  headers: {
    Authorization:
      "bearer XkjWF9GSy19xRS_yytCtISMaViqsPuXGmQiTzzAdcRHHNJmISD9bnHisRb8tgF5H7xVuMnbcybxOvEHHM7o91yTFKcGO7KrERhOSMS9NtRiPQNq9tCxMl61oD10pXnYx",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost"
  }
};

const Zomatoconfig = {
  headers: {
    "user-key": "5a09665cb72fa8f5a661296e9ed00af4",
    Accept: "application/json"
  }
};

const DjangoConfig = {
  headers: { Authorization: "Token " + localStorage.getItem("UserToken") }
};

export default class ReviewAnalytics extends Component {
  state = {
    fbAccounts: [],
    fbToken: "",
    locationIdGoogle: "",
    loader: true,
    all_connections: [],

    yelpReviews: [],
    yelpDetails: [],
    googleReviews: [],
    foursquareReviews: [],
    foursquareDetails: [],
    foursquareReviewCount: "-",
    today: "",
    fb_new_reviews: "-",
    google_new_reviews: "-",
    yelp_new_reviews: "-",
    foursquare_new_reviews: "-",

    citysearchNewReviews: "-",
    citysearchRating: "-",
    citysearchReviewCount: "-",

    appleRating: "-",
    appleReviewCount: "-",

    hereRating: "-",
    hereReviews: "-",

    zillowRating: "-",
    zillowReviews: "-",

    tomtomRating: "-",
    tomtomReviews: "-",
    tomtomNewReviews: "-",

    avvoRating: "-",
    avvoReviews: "-",

    zomatoRating: "-",
    zomatoReviews: "-"
  };

  componentDidMount() {
    var today = new Date();
    this.setState({ today });
    var yelpUrl,
      fourUrl,
      fbtoken,
      fbPageId,
      googleToken,
      appleUrl,
      citysearchUrl,
      hereUrl,
      zillowUrl,
      tomtomUrl,
      avvoUrl,
      avvoToken,
      zomatoUrl;

    const data = {
      location_id: this.props.match.params.locationId
    };

    // Axios.post(
    //   "https://cors-anywhere.herokuapp.com/https://dashify.biz/locations/get-all-connection-of-one-location",
    //   data,
    //   DjangoConfig
    // )
    all_connection_of_one_location(data, DjangoConfig).then(response => {
      console.log(response);

      this.setState({ loader: false });
      response.data.data.map(l => {
        if (l.Social_Platform.Platform == "Facebook") {
          fbtoken = l.Social_Platform.Token;
          console.log(fbtoken);
          fbPageId = l.Social_Platform.Other_info;
        }

        if (l.Social_Platform.Platform == "Google") {
          console.log("yes goo");
          googleToken = l.Social_Platform.Token;
          console.log(googleToken);
          this.setState({ locationIdGoogle: l.Social_Platform.Other_info });
        }

        if (l.Social_Platform.Platform == "Foursquare") {
          console.log("yes four");

          fourUrl = l.Social_Platform.Other_info.split(",")[0]
            .slice(7)
            .split("/")[5];
        }

        if (l.Social_Platform.Platform == "Yelp") {
          console.log("yes yelp");

          yelpUrl = l.Social_Platform.Other_info.split(",")[0].slice(7);
        }

        if (l.Social_Platform.Platform == "Apple") {
          appleUrl = l.Social_Platform.Other_info.split(",")[0]
            .slice(7)
            .split("/")[6]
            .slice(2);
        }

        if (l.Social_Platform.Platform == "Citysearch") {
          citysearchUrl = l.Social_Platform.Other_info.split(",")[0]
            .slice(7)
            .split("/")[4];
        }
        if (l.Social_Platform.Platform == "Here") {
          hereUrl = l.Social_Platform.Other_info;
        }
        if (l.Social_Platform.Platform == "Zillow") {
          zillowUrl = l.Social_Platform.Other_info;
        }
        if (l.Social_Platform.Platform == "Tomtom") {
          tomtomUrl = l.Social_Platform.Other_info;
        }
        if (l.Social_Platform.Platform == "Avvo") {
          avvoUrl = l.Social_Platform.Other_info;
          avvoToken = l.Social_Platform.Token;
        }
        if (l.Social_Platform.Platform == "Zomato") {
          zomatoUrl = l.Social_Platform.Other_info;
        }
      });

      // for facebook
      if (fbtoken) {
        Axios.get(
          "https://graph.facebook.com/me/accounts?fields=access_token,id,name,overall_star_rating,category,category_list,tasks&access_token=" +
            fbtoken
        ).then(resp => {
          this.setState({ fbAccounts: resp.data.data });
          var fbPageAccessToken, index;
          for (let i = 0; i < resp.data.data.length; i++) {
            if (resp.data.data[i].id == fbPageId) {
              fbPageAccessToken = resp.data.data[i].access_token;
              index = i;
            }
          }
          Axios.get(
            "https://graph.facebook.com/" +
              fbPageId +
              "/ratings?fields=has_rating,review_text,created_time,has_review,rating,recommendation_type&access_token=" +
              fbPageAccessToken
          ).then(res => {
            console.log("facebook reviews", res.data.data);
            this.setState({
              fbReviews: res.data.data.length,
              fb_average_rating: resp.data.data[index].overall_star_rating
            });
            let fb_new_reviews = 0;
            for (let j = 0; j < res.data.data.length; j++) {
              let create_time1 = res.data.data[j].created_time;
              if (parseInt(create_time1.slice(0, 4)) == today.getFullYear()) {
                if (
                  parseInt(create_time1.slice(5, 7)) ==
                  today.getMonth() + 1
                ) {
                  if (parseInt(create_time1.slice(8, 10)) == today.getDate()) {
                    fb_new_reviews++;
                  }
                }
              }
            }
            this.setState({ fb_new_reviews });
            this.setState({
              all_connections: [
                ...this.state.all_connections,
                { name: "Facebook" }
              ]
            });
          });
        });
      }

      //for yelp

      if (yelpUrl) {
        Axios.get(
          "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" +
            yelpUrl.slice(25) +
            "/reviews",
          Yelpconfig
        ).then(resp => {
          console.log("yelp reviews", resp.data);
          this.setState({ yelpReviews: resp.data.reviews });

          let yelp_new_reviews = 0;
          for (let j = 0; j < resp.data.reviews.length; j++) {
            let create_time1 = resp.data.reviews[j].time_created;
            if (parseInt(create_time1.slice(0, 4)) == today.getFullYear()) {
              if (parseInt(create_time1.slice(5, 7)) == today.getMonth() + 1) {
                if (parseInt(create_time1.slice(8, 10)) == today.getDate()) {
                  yelp_new_reviews++;
                }
              }
            }
          }
          this.setState({ yelp_new_reviews });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Yelp" }
            ]
          });
        });

        Axios.get(
          "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" +
            yelpUrl.slice(25),
          Yelpconfig
        ).then(resp => {
          console.log("hii");
          console.log("yelp details", resp.data);
          this.setState({ yelpDetails: resp.data });
        });
      }

      // for google

      const GoogleConfig = {
        headers: { Authorization: "Bearer " + googleToken }
      };

      if (googleToken) {
        Axios.get(
          "https://mybusiness.googleapis.com/v4/accounts/",
          GoogleConfig
        ).then(res => {
          console.log(res.data);
          localStorage.setItem("accountId", res.data.accounts[0].name);

          // Axios.get(
          //   "https://mybusiness.googleapis.com/v4/" +
          //     localStorage.getItem("accountId") +
          //     "/locations",
          //   GoogleConfig
          // ).then(resp => {
          //   console.log(resp.data);

          //   localStorage.setItem(
          //     "locationIdGoogle",
          //     resp.data.locations[0].name
          //   );
          Axios.get(
            "https://mybusiness.googleapis.com/v4/" +
              this.state.locationIdGoogle +
              "/reviews",
            GoogleConfig
          ).then(respo => {
            console.log("google reviews", respo.data);
            this.setState({ googleReviews: respo.data });
            let google_new_reviews = 0;
            if (respo.data.reviews) {
              for (let j = 0; j < respo.data.reviews.length; j++) {
                let create_time1 = respo.data.reviews[j].updateTime;
                if (parseInt(create_time1.slice(0, 4)) == today.getFullYear()) {
                  if (
                    parseInt(create_time1.slice(5, 7)) ==
                    today.getMonth() + 1
                  ) {
                    if (
                      parseInt(create_time1.slice(8, 10)) == today.getDate()
                    ) {
                      google_new_reviews++;
                    }
                  }
                }
              }
            }
            this.setState({ google_new_reviews });
            this.setState({
              all_connections: [
                ...this.state.all_connections,
                { name: "Google" }
              ]
            });
          });
          // });
        });
      }

      // For foursquare

      //   var fourUrl=localStorage.getItem('fourUrl');

      if (fourUrl) {
        Axios.get(
          "https://api.foursquare.com/v2/venues/" +
            fourUrl +
            "?client_id=TEUSFAUY42IR0HGTPSWO1GFLC5WHX3PIBKVICAQRZQA0MTD1&client_secret=CYBQFK0YRBPFE54NARAEJCG2NLBARIU2OOIJNE0AZOHWZTXU&v=20180323"
        ).then(res => {
          console.log("foursquare data", res.data.response.venue);
          this.setState({
            foursquareReviews: res.data.response.venue.tips.groups[0] ? res.data.response.venue.tips.groups[0].items :[],
            foursquareDetails: res.data.response.venue,
            foursquareReviewCount: res.data.response.venue.tips.count
          });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Foursquare" }
            ]
          });
        });
      }

      if (appleUrl) {
        Axios.get(
          "https://itunes.apple.com/in/rss/customerreviews/id=" +
            appleUrl +
            "/sortBy=mostRecent/json"
        ).then(res => {
          console.log("apple data", res.data);

          let appleRating = 0;
          let appleReviews = res.data.feed.entry;

          for (let i = 0; i < appleReviews.length; i++) {
            appleRating += parseInt(appleReviews[i]["im:rating"].label);
          }
          appleRating = parseInt(
            (appleRating / appleReviews.length).toString().slice(0, 3)
          );
          this.setState({
            appleRating,
            appleReviewCount: res.data.feed.entry.length
          });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Apple" }
            ]
          });
        });
      }

      if (citysearchUrl) {
        Axios.get(
          "https://cors-anywhere.herokuapp.com/https://api.citygridmedia.com/content/reviews/v2/search/where?listing_id=" +
            citysearchUrl +
            "&publisher=test"
        ).then(res => {
          var XMLParser = require("react-xml-parser");
          var xml = new XMLParser().parseFromString(res.data); // Assume xmlText contains the example XML
          console.log("citysearch details", xml);
          console.log("citysearch reviews", xml.getElementsByTagName("review"));

          let citysearchReviews = xml.getElementsByTagName("review");
          var citysearchRating = 0;
          var citysearchNewReviews = 0;
          for (let i = 0; i < citysearchReviews.length; i++) {
            citysearchRating +=
              parseInt(citysearchReviews[i].children[5].value) / 2;

            let create_time1 = citysearchReviews[i].children[6].value;
            if (parseInt(create_time1.slice(0, 4)) == today.getFullYear()) {
              if (parseInt(create_time1.slice(5, 7)) == today.getMonth() + 1) {
                if (parseInt(create_time1.slice(8, 10)) == today.getDate()) {
                  citysearchNewReviews++;
                }
              }
            }
          }
          citysearchRating = parseInt(
            (citysearchRating / citysearchReviews.length).toString().slice(0, 3)
          );
          this.setState({
            citysearchNewReviews,
            citysearchRating,
            citysearchReviewCount: xml.getElementsByTagName("review").length
          });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Citysearch" }
            ]
          });
        });
      }

      //Here

      if (hereUrl) {
        Axios.get(hereUrl).then(res => {
          console.log("Here data", res.data);

          let hereRating =
            res.data.media.ratings.items.length >= 1
              ? res.data.media.ratings.items[0].average
              : "-";
          let hereReviews =
            res.data.media.ratings.items.length >= 1
              ? res.data.media.ratings.items[0].count
              : "-";
          this.setState({
            hereRating,
            hereReviews: hereReviews
          });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Here" }
            ]
          });
        });
      }

      // zillow

      if (zillowUrl) {
        Axios.get(
          "https://www.zillow.com/webservice/ProReviews.htm?zws-id=X1-ZWz173vkfofw97_8e096&email=" +
            zillowUrl +
            "&count=10&output=json"
        ).then(res => {
          console.log("zillow data", res.data);

          let zillowRating = res.data.response.results.proInfo.avgRating
            ? parseFloat(res.data.response.results.proInfo.avgRating)
            : 0;
          let zillowReviews = parseInt(
            res.data.response.results.proInfo.reviewCount
          );
          this.setState({
            zillowRating,
            zillowReviews
          });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Zillow" }
            ]
          });
        });
      }

      // tomtom

      if (tomtomUrl) {
        if (tomtomUrl == "-") {
          this.setState({
            tomtomRating: 0,
            tomtomReviews: 0,
            tomtomNewReviews: 0
          });
        } else {
          Axios.get(
            "https://api.tomtom.com/search/2/poiDetails.json?key=BVtLuLXu3StRT6YXupe4H9cbtugU3i10&id=" +
              tomtomUrl
          ).then(res => {
            console.log("tomtom data", res.data);

            let tomtomRating = res.data.result.rating
              ? parseFloat(res.data.result.rating.value) / 2
              : 0;

            let tomtomReviews = parseInt(res.data.result.rating.totalRatings);

            var tomtomNewReviews = 0;
            for (let i = 0; i < res.data.result.reviews.length; i++) {
              let create_time1 = res.data.result.reviews[i];
              if (parseInt(create_time1.slice(0, 4)) == today.getFullYear()) {
                if (
                  parseInt(create_time1.slice(5, 7)) ==
                  today.getMonth() + 1
                ) {
                  if (parseInt(create_time1.slice(8, 10)) == today.getDate()) {
                    tomtomNewReviews++;
                  }
                }
              }
            }
            this.setState({
              tomtomRating,
              tomtomReviews,
              tomtomNewReviews
            });
            this.setState({
              all_connections: [
                ...this.state.all_connections,
                { name: "Tomtom" }
              ]
            });
          });
        }
      }

      // avvo

      if (avvoUrl && avvoToken) {
        const AvvoConfig = {
          headers: {
            Authorization: "Bearer " + avvoToken
          }
        };
        Axios.get(
          "https://cors-anywhere.herokuapp.com/https://api.avvo.com/api/4/lawyers.json?id[]=" +
            avvoUrl,
          AvvoConfig
        ).then(res => {
          console.log("avvo lawyer data in json", res.data);

          let avvoRating = parseFloat(res.data.lawyers[0].client_review_score);
          let avvoReviews = parseInt(res.data.lawyers[0].client_review_count);
          this.setState({
            avvoRating,
            avvoReviews
          });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Avvo" }
            ]
          });
        });
      }

      // zomato

      if (zomatoUrl) {
        Axios.get(
          "https://developers.zomato.com/api/v2.1/restaurant?res_id=" +
            zomatoUrl,
          Zomatoconfig
        ).then(res => {
          console.log("zomato data", res.data);

          let zomatoRating = res.data.user_rating.aggregate_rating
            ? parseFloat(res.data.user_rating.aggregate_rating)
            : 0;
          let zomatoReviews = parseInt(res.data.all_reviews_count);
          this.setState({
            zomatoRating,
            zomatoReviews
          });
          this.setState({
            all_connections: [
              ...this.state.all_connections,
              { name: "Zomato" }
            ]
          });
        });
      }
    }).catch(res => {
      console.log("error in review analytics", res);
      this.setState({
        loader: false
      });
    });
  }

  render() {
    console.log("states", this.state);

    let {all_connections} = this.state;

    var total_new_reviews =
      (this.state.fb_new_reviews == "-" ? 0 : this.state.fb_new_reviews) +
      (this.state.google_new_reviews == "-"
        ? 0
        : this.state.google_new_reviews) +
      (this.state.yelp_new_reviews == "-" ? 0 : this.state.yelp_new_reviews) +
      (this.state.citysearchNewReviews == "-"
        ? 0
        : this.state.citysearchNewReviews) +
      (this.state.tomtomNewReviews == "-" ? 0 : this.state.tomtomNewReviews);

    //rating calculation
    var overAllRating = 0,
      overAllReviewCount = 0;

    let a = 0;
    a =
      a +
      (this.state.yelpDetails.rating > 0 ? 1 : 0) +
      (this.state.googleReviews.averageRating > 0 ? 1 : 0) +
      (this.state.foursquareDetails.rating > 0 ? 1 : 0) +
      (this.state.fb_average_rating > 0 ? 1 : 0) +
      (this.state.appleRating > 0 ? 1 : 0) +
      (this.state.citysearchRating > 0 ? 1 : 0) +
      (this.state.hereRating > 0 ? 1 : 0) +
      (this.state.zillowRating > 0 ? 1 : 0) +
      (this.state.tomtomRating > 0 ? 1 : 0) +
      (this.state.avvoRating > 0 ? 1 : 0) +
      (this.state.zomatoRating > 0 ? 1 : 0);

    overAllRating =
      (this.state.yelpDetails.rating ? this.state.yelpDetails.rating : 0) +
      (this.state.googleReviews.averageRating
        ? this.state.googleReviews.averageRating
        : 0) +
      (this.state.foursquareDetails.rating
        ? this.state.foursquareDetails.rating / 2
        : 0) +
      (this.state.fb_average_rating ? this.state.fb_average_rating : 0) +
      (this.state.appleRating && (this.state.appleRating != "-") ? this.state.appleRating : 0) +
      (this.state.citysearchRating && (this.state.citysearchRating != "-") ? this.state.citysearchRating : 0) +
      (this.state.hereRating != "-" ? this.state.hereRating : 0) +
      (this.state.zillowRating != "-" ? this.state.zillowRating : 0) +
      (this.state.tomtomRating != "-" ? this.state.tomtomRating : 0) +
      (this.state.avvoRating != "-" ? this.state.avvoRating : 0) +
      (this.state.zomatoRating != "-" ? this.state.zomatoRating : 0);
      
      // console.log("all rating",this.state.yelpDetails.rating,this.state.googleReviews.averageRating,this.state.foursquareDetails.rating,this.state.fb_average_rating,this.state.appleRating,this.state.citysearchRating,this.state.hereRating,this.state.zillowRating,this.state.tomtomRating,this.state.avvoRating,this.state.zomatoRating)

    overAllRating = a == 0 ? "-" : overAllRating / a;

    overAllReviewCount =
      (this.state.fbReviews ? this.state.fbReviews : 0) +
      (this.state.yelpDetails.review_count
        ? this.state.yelpDetails.review_count
        : 0) +
      (this.state.googleReviews.totalReviewCount
        ? this.state.googleReviews.totalReviewCount
        : 0) +
      (this.state.foursquareReviewCount == "-"
        ? 0
        : this.state.foursquareReviewCount) +
      (this.state.appleReviewCount == "-" ? 0 : this.state.appleReviewCount) +
      (this.state.citysearchReviewCount == "-"
        ? 0
        : this.state.citysearchReviewCount) +
      (this.state.hereReviews == "-" ? 0 : this.state.hereReviews) +
      (this.state.zillowReviews == "-" ? 0 : this.state.zillowReviews) +
      (this.state.tomtomReviews == "-" ? 0 : this.state.tomtomReviews) +
      (this.state.avvoReviews == "-" ? 0 : this.state.avvoReviews) +
      (this.state.zomatoReviews == "-" ? 0 : this.state.zomatoReviews);

    console.log(overAllReviewCount);

    // if (this.state.foursquareReviewCount) {
    var pieData = [
      ["Site", "Total Reviews"],
      ["Google", this.state.googleReviews.totalReviewCount],
      ["Facebook", this.state.fbReviews],
      ["Yelp", this.state.yelpDetails.review_count],
      [
        "Foursquare",
        this.state.foursquareReviewCount == "-"
          ? 0
          : this.state.foursquareReviewCount
      ],
      [
        "Apple",
        this.state.appleReviewCount == "-" ? 0 : this.state.appleReviewCount
      ],
      [
        "Citysearch",
        this.state.citysearchReviewCount == "-"
          ? 0
          : this.state.citysearchReviewCount
      ],
      ["Here", this.state.hereReviews == "-" ? 0 : this.state.hereReviews],
      [
        "Zillow",
        this.state.zillowReviews == "-" ? 0 : this.state.zillowReviews
      ],
      [
        "Tomtom",
        this.state.tomtomReviews == "-" ? 0 : this.state.tomtomReviews
      ],
      ["Avvo", this.state.avvoReviews == "-" ? 0 : this.state.avvoReviews],
      ["Zomato", this.state.zomatoReviews == "-" ? 0 : this.state.zomatoReviews]
    ];
    // }

    var columnData = [
      [
        "Site",
        "Average Rating",
        { role: "style" },
        {
          sourceColumn: 0,
          role: "annotation",
          type: "string",
          calc: "stringify"
        }
      ],
      [
        "Google",
        this.state.googleReviews.averageRating
          ? this.state.googleReviews.averageRating
          : 0,
        "#085bff",
        null
      ],
      [
        "Facebook",
        this.state.fbAccounts[0] ? this.state.fb_average_rating : 0,
        "#085bff",
        null
      ],
      [
        "Yelp",
        this.state.yelpDetails.rating ? this.state.yelpDetails.rating : 0,
        "#085bff",
        null
      ],
      [
        "Apple",
        this.state.appleRating ? this.state.appleRating : 0,
        "#085bff",
        null
      ],
      [
        "Citysearch",
        this.state.citysearchRating ? this.state.citysearchRating : 0,
        "#085bff",
        null
      ],
      [
        "Foursquare",
        this.state.foursquareDetails.rating
          ? this.state.foursquareDetails.rating / 2
          : 0,
        "#085bff",
        null
      ],
      [
        "Here",
        this.state.hereRating != "-" ? this.state.hereRating : 0,
        "#085bff",
        null
      ],
      [
        "Zillow",
        this.state.zillowRating != "-" ? this.state.zillowRating : 0,
        "#085bff",
        null
      ],
      [
        "Tomtom",
        this.state.tomtomRating != "-" ? this.state.tomtomRating : 0,
        "#085bff",
        null
      ],
      [
        "Avvo",
        this.state.avvoRating != "-" ? this.state.avvoRating : 0,
        "#085bff",
        null
      ],
      [
        "Zomato",
        this.state.zomatoRating != "-" ? this.state.zomatoRating : 0,
        "#085bff",
        null
      ]
    ];

    return (
      <div>
        {/* <div className="content-page"> */}

        {this.state.loader ? (
          <div className="rightside_title">
            <Spinner />
          </div>
        ) : (
        <div className="main_content">
        <div className="rightside_title">
          <h1>Review Analytics</h1>
        </div>
        {all_connections.length != 0 ?
        <div>
        <div className=" mb-30">
          <div className="antbox">
            <div className="box-space ">
              <h2 className="analytics_btnx">
                Analytics
               <div className="dropdown">
                  <a
                    href="#"
                    className="last_btn dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    <i className="zmdi zmdi-calendar"></i>
                    Last six month
                    <span className="zmdi zmdi-caret-down"></span>
                  </a>
                  <div className="dropdown-menu">
                    <ul>
                      <li>Last three month</li>
                      <li>Last nine month</li>
                    </ul>
                  </div>
                </div> 
              </h2>
            </div>

            <div className="total_ant">
              <div className="row">
                <div className="col-md-3">
                  <div className="totl-listing">
                  <h3>Total Review</h3>
                    <div className="icon">
                      <div className="icon-comment">
                    <i className="zmdi zmdi-comment-outline"></i>
                    </div>
                    </div>
                    <div className="icon-text">
                      <h2>
                        {overAllReviewCount ? overAllReviewCount : "-"}
                        <div className="dropdown parsent">
                          <a
                            href="#"
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            {/* 160% */}-
                            <span className="zmdi zmdi-caret-down"></span>
                          </a>
                          {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                        </div>
                      </h2>
                      
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="totl-listing">
                  <h3>New Review</h3>
                    <div className="icon">
                    <div className="icon-comment">
                    <i className="zmdi zmdi-comments"></i>
                    </div>
                    </div>
                    <div className="icon-text">

                      <h2>
                        {total_new_reviews == 0 ? "-" : total_new_reviews}
                        <div className="dropdown parsent">
                          <a
                            href="#"
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            {/* 160% */}-
                            <span className="zmdi zmdi-caret-down"></span>
                          </a>
                          {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                        </div>
                      </h2>
                     
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="totl-listing">
                  <h3>Average Rating</h3>
                    <div className="icon">
                    <div className="icon-comment">
                    <i className="zmdi zmdi-trending-up"></i>
                    </div>
                    </div>
                    <div className="icon-text">
                      <h2>
                        {overAllRating != 0
                          ? overAllRating.toString().slice(0, 4)
                          : "-"}
                        <div className="dropdown parsent">
                          <a
                            href="#"
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            {/* 160% */}-
                            <span className="zmdi zmdi-caret-down"></span>
                          </a>
                          {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                        </div>
                      </h2>
                     
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="totl-listing">
                  <h3>Review Response rate</h3>
                    <div className="icon">
                    <div className="icon-comment">
                    <i className="zmdi zmdi-share"></i>
                    </div>
                    </div>
                    <div className="icon-text">
                      <h2>
                        {/* 84 */}-
                        <div className="dropdown parsent">
                          <a
                            href="#"
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            {/* 160% */}-
                            <span className="zmdi zmdi-caret-down"></span>
                          </a>
                          {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                        </div>
                      </h2>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" mt-30">
          <div className="analytics-whice">
            <div className="box-space2">
              <table
                id="example"
                className="analytics-whice"
                cellSpacing="0"
                width="100%"
              >
                <thead>
                  <tr className="thead-color">
                    <th>Review Sites (5)</th>
                    <th>Avg.Rating</th>
                    <th>Total Review</th>
                    <th>New Reviews</th>
                    <th>Rencency</th>
                    <th>Base Rating</th>
                    <th>Base Review</th>
                  </tr>
                </thead>

                <tbody className="cons">
                  <tr>
                    <td>Consolidated</td>
                    <td>
                      {overAllRating != 0
                        ? overAllRating.toString().slice(0, 4)
                        : "-"}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >{/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {overAllReviewCount ? overAllReviewCount : "-"}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        > {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {total_new_reviews == 0 ? "-" : total_new_reviews}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>
                  <tr>
                    <td >Google</td>
                    <td>
                      {this.state.googleReviews.averageRating
                        ? this.state.googleReviews.averageRating
                        : "-"}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.googleReviews.totalReviewCount
                        ? this.state.googleReviews.totalReviewCount
                        : "-"}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.google_new_reviews}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>
                  <tr>
                    <td>Facebook</td>
                    <td>
                      {this.state.fbAccounts[0]
                        ? this.state.fb_average_rating
                        : "-"}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.fbReviews ? this.state.fbReviews : "-"}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.fb_new_reviews}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>
                  <tr>
                    <td>Yelp</td>
                    <td>
                      {this.state.yelpDetails.rating
                        ? this.state.yelpDetails.rating
                        : "-"}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.yelpDetails.review_count
                        ? this.state.yelpDetails.review_count
                        : "-"}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.yelp_new_reviews}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >{/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>
                  <tr>
                    <td>Foursquare</td>
                    <td>
                      {this.state.foursquareDetails.rating / 2
                        ? this.state.foursquareDetails.rating / 2
                        : "-"}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.foursquareReviewCount
                        ? this.state.foursquareReviewCount
                        : "-"}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {/* 06 */}-{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>

                  {/* apple */}
                  <tr>
                    <td>Apple</td>
                    <td>
                      {this.state.appleRating}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        > {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.appleReviewCount}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >{/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      -
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>

                  {/* citysearch */}
                  <tr>
                    <td>Citysearch</td>
                    <td>
                      {this.state.citysearchRating}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.citysearchReviewCount}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.citysearchNewReviews}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>

                  {/* here */}
                  <tr>
                    <td>Here</td>
                    <td>
                      {this.state.hereRating}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >{/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.hereReviews}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {/* {this.state.citysearchNewReviews} */}-
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>

                  {/* zillow */}
                  <tr>
                    <td>Zillow</td>
                    <td>
                      {this.state.zillowRating}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >{/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.zillowReviews}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {/* {this.state.citysearchNewReviews} */}-
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>

                  {/* tomtom */}
                  <tr>
                    <td>Tomtom</td>
                    <td>
                      {this.state.tomtomRating.toString().slice(0, 3)}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.tomtomReviews}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.tomtomNewReviews}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>

                  {/* avvo */}
                  <tr>
                    <td>Avvo</td>
                    <td>
                      {this.state.avvoRating.toString().slice(0, 3)}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.avvoReviews}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {/* {this.state.citysearchNewReviews} */}-
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>

                  {/* zomato */}
                  <tr>
                    <td>Zomato</td>
                    <td>
                      {this.state.zomatoRating}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {this.state.zomatoReviews}{" "}
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                           {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                         
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>
                      {/* {this.state.citysearchNewReviews} */}-
                      <div className="dropdown tablebx_d">
                        <a
                          href="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          {/* 160% */}-
                          <span className="zmdi zmdi-caret-down"></span>{" "}
                          
                        </a>
                        {/* <div className="dropdown-menu">
                            <ul>
                              <li>-</li>
                              <li>-</li>
                            </ul>
                          </div> */}
                      </div>
                    </td>
                    <td>{/* 1 days */}-</td>
                    <td>{/* 4.1 */}-</td>
                    <td>{/* 160 */}-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
                        </div> : <div className=" mt-30">
          <div className="analytics-whice">
            <div className="box-space2"><h4>Connect some listings to see Review Analytics</h4></div></div></div> }

        <div className="mt-30">
          <div className="row">
            <div className="col-md-6">
              
                {/* <img src={require('../images/pie-1.jpg')}/> */}

                {all_connections.length != 0 ?
                <div className="whitechart">
                   <Chart
                  width={"500px"}
                  height={"300px"}
                  chartType="ColumnChart"
                  loader={<div>Loading Chart</div>}
                  data={columnData}
                  options={{
                    title: "Sitewise Distribution Of Ratings",
                    width: 580,
                    height: 500,
                    bar: { groupWidth: "25%" },
                    legend: {
                      position: "none",
                      textStyle: { color: "black", fontSize: 6 }
                    }
                  }}
                  // For tests
                  rootProps={{ "data-testid": "6" }}
                /> </div> : ""}
              
            </div>
            <div className="col-md-6">
              
                {/* <img src={require('../images/pie.jpg')}/> */}

                {all_connections.length != 0 ? 
                <div className="whitechart">
                  <Chart
                  width={"500px"}
                  height={"500px"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={pieData}
                  options={{
                    title: "Sitewise Distribution Reviews",
                    pieSliceText: "label",
                    legend: "none",
                    pieHole: 0.4
                  }}
                  rootProps={{ "data-testid": "1" }}
                /> 
                </div>: ""}
              
            </div>
            
          </div>
        </div>
      </div>
        )
      }

        {/* </div> */}
      </div>
    );
  }
}
