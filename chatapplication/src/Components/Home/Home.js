import React, { Component } from "react";
import { Grid } from "@material-ui/core";
//  OR
//import  Grid  from "@material-ui/core/Grid";
import "../Styles/Home.css";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
class Home extends Component {
  render() {
    const paper = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: "60px",
    };
    return (
      <Grid container component='main' className='root'>
        <Grid item xs={1} sm={4} md={7} className='imagehome'>
          <div className='homeleftimage'></div>
        </Grid>

        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          className='homerightcomponent'
          elevation={6}
          square
        >
          <Card className='homeitem1'>
            <button className='btnhome'>
              <i class='fa fa-home'>Welcome</i>
            </button>
          </Card>
          <div style={paper}>
            <h1
              style={{
                color: "white",
                backgroundColor: "pink",
                padding: "10px",
              }}
            >
              Web Chat Application
            </h1>
            <Link to='/signin'>
              <button className='button1'>
                <span>Login</span>
              </button>
            </Link>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
