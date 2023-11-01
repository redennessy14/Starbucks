import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Category, productsContext } from "../../context/productContext";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  updateMetadata,
} from "firebase/storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateCard = () => {
  const { addCard, getCategories } = useContext(productsContext);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<any>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string>("");

  const navigate = useNavigate();

  const handleCreateCard = async () => {
    const storage = getStorage();
    console.log(image, "image");

    const imageRef = ref(storage, "card_images/" + image.name);

    await uploadBytes(imageRef, image);

    const metadata = {
      contentType: "image/jpeg",
    };
    await updateMetadata(imageRef, metadata);

    const imageUrl = await getDownloadURL(imageRef);
    console.log(imageUrl, "urlimage");

    addCard(name, description, price, imageUrl, category);

    toast.success("Card created");
    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setCategory("");
    navigate("/menu");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
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
        {" "}
        <TextField
          value={name}
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
          label="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          value={description}
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
          label="Description"
          type="text"
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          value={price}
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
          label="Price"
          type="text"
          onChange={(e) => setPrice(e.target.value)}
        />
        <InputLabel id="demo-select-small-label">Category</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{
            width: "30%",
            "& label.Mui-focused": {
              color: "#036635",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#036635",
              },
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {categories &&
            categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
        </Select>
        <Button
          sx={{
            marginTop: "30px",
            width: "30%",
            backgroundColor: "#036635",
            "&:hover": {
              backgroundColor: "#036635",
            },
          }}
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <Input
            onChange={handleImageChange}
            sx={{ display: "none" }}
            className="uploadFile"
            type="file"
          />
        </Button>
        <Button
          variant="contained"
          style={{ color: "white", backgroundColor: "#036635" }}
          sx={{ marginTop: "30px", width: "30%" }}
          onClick={handleCreateCard}
        >
          Create Card
        </Button>
      </Grid>
    </>
  );
};

export default CreateCard;
