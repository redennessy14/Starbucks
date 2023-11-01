import { CheckBox } from "@mui/icons-material";
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

const Register = () => {
  const { authWithGoogle, signUp } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    try {
      await signUp(email, password);
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
          Sign up to Starbucks
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
          onClick={handleSubmit}
        >
          Sign up
        </Button>
        <Button
          variant="contained"
          style={{ color: "white", backgroundColor: "#036635" }}
          sx={{ marginTop: "30px", width: "30%" }}
          onClick={() => authWithGoogle()}
        >
          Countinue with Google
        </Button>
        <FormControl>
          <FormControlLabel
            sx={{ marginTop: "30px" }}
            control={<CheckBox />}
            label="Remember me"
          />
        </FormControl>
      </Grid>
    </>
  );
};

export default Register;
