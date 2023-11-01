import React, {
  useContext,
  useState,
  MouseEvent,
  useEffect,
  ChangeEvent,
} from "react";
import "./Navbar.css";
import LOGO from "../images/1200px-Starbucks_Coffee_Logo.svg.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthContext } from "../context/authContext";
import {
  Button,
  InputAdornment,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Tooltip,
} from "@mui/material";

import { useNavigate, useSearchParams } from "react-router-dom";
import { CardI, productsContext } from "../context/productContext";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const Navbar = () => {
  const { user, logOut } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const {
    getBasket,
    addToBasket,
    removeFromBasketFunction,
    getCards,
    incrementCount,
    decrementCount,
  } = useContext(productsContext);

  const [basket, setBasket] = useState<CardI[]>([]);

  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    handleClose();
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartClick = (event: MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCartAnchorEl(null);
  };

  const open = Boolean(cartAnchorEl);
  const id = open ? "cart-popover" : undefined;

  useEffect(() => {
    const fetchBasket = async () => {
      try {
        const fetchedBasket = await getBasket(user);
        setBasket(fetchedBasket);
      } catch (error) {
        console.error("Ошибка получения корзины:", error);
      }
    };

    fetchBasket();
  }, [user, getBasket, handleCartClick]);

  const removeFromBasket = (card: CardI) => {
    removeFromBasketFunction(user, card);
    toast.error("Product delete from basket");
  };
  const getTotalPrice = () => {
    let total = 0;

    if (basket && basket.length > 0) {
      basket.forEach((item) => {
        total += parseFloat(item.price) * item.count;
      });
    }

    return total.toFixed(2);
  };

  return (
    <div>
      <div className="navbar">
        <img
          src={LOGO}
          alt="logo"
          className="logo"
          onClick={() => navigate("/home")}
        />
        <div className="navbar__item1">
          {" "}
          <div onClick={() => navigate("/home")}>Home</div>
          <div onClick={() => navigate("/menu")}>Menu</div>
        </div>
        <div className="navbar__item2">
          <div>
            <div>
              <InputBase
                placeholder="Search…"
                onChange={({ target }) => {
                  searchParams.set("title", target.value);
                  setSearchParams(searchParams);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </div>
          </div>
          <div>
            {" "}
            <Button style={{ color: "black" }} onClick={handleCartClick}>
              <ShoppingCartIcon />
              {basket ? basket.length : 0}
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={cartAnchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Paper
                style={{
                  width: 500,
                  padding: "10px",
                  backgroundColor: "wheat",
                }}
              >
                {basket && basket.length > 0 ? (
                  basket.map((item, index) => (
                    <MenuItem key={index}>
                      <p>
                        <span>
                          {item.name} - {item.price}$ -{" "}
                          <IconButton
                            onClick={() => {
                              if (user && item.id) {
                                decrementCount(user, item.id);
                              }
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          {item.count}
                        </span>
                        <IconButton
                          onClick={() => {
                            if (user && item.id) {
                              incrementCount(user, item.id);
                            }
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                        <Button
                          color="error"
                          onClick={() => {
                            removeFromBasket(item);
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </p>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <p>Your basket is empty</p>
                  </MenuItem>
                )}
                <div>
                  <div className="total_price">
                    Total Price: ${getTotalPrice()}
                  </div>
                  <Button
                    variant="contained"
                    style={{
                      marginLeft: "25px",
                      color: "white",
                      backgroundColor: "#036635",
                      margin: "25px 0 25px 25px",
                    }}
                  >
                    Buy
                  </Button>
                </div>
              </Paper>
            </Popover>
          </div>{" "}
          {user ? (
            <div>
              <Tooltip title={user.email} arrow>
                <Button style={{ color: "black" }} onClick={handleClick}>
                  <AccountCircleIcon />
                </Button>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate("/create-category")}>
                  Create Category
                </MenuItem>
                <MenuItem onClick={() => navigate("/create-card")}>
                  Create Card
                </MenuItem>
                <MenuItem onClick={handleLogOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Button
                variant="contained"
                style={{ color: "white", backgroundColor: "#036635" }}
                onClick={() => navigate("/sign-in")}
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                style={{
                  marginLeft: "25px",
                  color: "white",
                  backgroundColor: "#036635",
                }}
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
