import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useAuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const { signIn, user } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignInSubmit = async () => {
    try {
      await signIn(email, password);
      navigate("/menu");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        marginTop="70px"
      >
        {error && <Alert security="error">{error}</Alert>}
        <Typography
          sx={{
            fontFamily: "Montserat sans-serif",
            letterSpacing: "2px",
            fontSize: "32px",
          }}
        >
          Sign in to Starbucks
        </Typography>
        <TextField
          sx={{
            marginTop: "30px",
            width: "30%",
            "& label.Mui-focused": {
              color: "#036635",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#036635",
              },
          }}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          sx={{
            marginTop: "30px",
            width: "30%",
            "& label.Mui-focused": {
              color: "#036635",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#036635",
              },
          }}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button
          variant="contained"
          style={{ color: "white", backgroundColor: "#036635" }}
          sx={{ marginTop: "30px", width: "30%" }}
          onClick={handleSignInSubmit}
        >
          Sign in
        </Button>
        <div style={{ marginTop: "15px" }}>
          {" "}
          Don`t have an account ? <Link to="/register"> Sign Up</Link>{" "}
        </div>
      </Grid>
    </>
  );
};

export default SignIn;
