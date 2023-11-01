import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Eclips from "../../images/Subtract.png";
import Eclips2 from "../../images/Subtract.png";
import ImgItem1 from "../../images/101270483.png";
import ImgItem2 from "../../images/Rectangle 1.png";
import ImgItem3 from "../../images/starbucks-png-11553978153odkhaxaedj-removebg-preview 1.png";
import ImgIce from "../../images/pngegg (3) 1.png";
import "./Home.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="first_block">
      <div className="container__left">
        <div className="container__left_item1">
          {" "}
          <img src={Eclips2} alt="" className="eclips2" />
          <img src={ImgItem3} alt="" className="imgItem3" />
          <Button
            style={{
              color: "white",
              backgroundColor: "#036635",
              margin: "30px 0 0 150px",
            }}
            onClick={() => navigate("/menu")}
          >
            Buy now
            <ArrowRightIcon />
          </Button>
        </div>
        <div className="container__left_item2">
          <h1>Caramel Latte</h1>
          <p>
            {" "}
            A sweeter version of the classic latte. Espresso and lactose-free
            milk come together in perfect harmony to bring lightness to your
            drink.
          </p>
          <h2>5.80$</h2>
        </div>
      </div>
      <div className="container__right">
        <img src={Eclips} alt="" className="eclips" />
        <img src={ImgItem1} alt="" className="imgItem1" />
        <img src={ImgItem2} alt="" className="imgItem2" />
        <img src={ImgIce} alt="" className="imgIce" />
      </div>
    </div>
  );
};

export default Home;
