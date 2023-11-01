import { Button, Grid, TextField, Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Category, productsContext } from "../../context/productContext";
import { toast } from "react-toastify";
import "./CreateCategory.css";

const CreateCategory = () => {
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const { addCategory, getCategories, deleteCategory, editCategory } =
    useContext(productsContext);

  const [categories, setCategories] = useState<Category[]>([]);

  const handleAddCategory = async () => {
    await addCategory(category);

    const categoriesData = await getCategories();
    setCategories(categoriesData);
    toast.success("Category created");
    setCategory("");
  };

  const handleDeleteCategory = async (id: string) => {
    deleteCategory(id);

    const categoriesData = await getCategories();
    toast.error("Category deleted");
    setCategories(categoriesData);
  };

  const handleEditCategory = async (id: string, newName: string) => {
    await editCategory(id, newName);

    const categoriesData = await getCategories();
    setCategories(categoriesData);
    toast.success("Category edited");
    setNewCategory("");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const startEditing = (categoryId: string) => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === categoryId) {
        cat.isEditing = true;
      } else {
        cat.isEditing = false;
      }
      return cat;
    });
    setCategories(updatedCategories);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      marginTop="70px"
    >
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
        label="Category Name"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Button
        variant="contained"
        style={{ color: "white", backgroundColor: "#036635" }}
        sx={{ marginTop: "30px", width: "30%" }}
        onClick={handleAddCategory}
      >
        Create Category
      </Button>
      <h2>Category List</h2>
      <div>
        <ul className="category__list">
          {categories.map((cat) => (
            <li className="category__list_item" key={cat.id}>
              {cat.isEditing ? (
                <div>
                  <TextField
                    sx={{
                      "& label.Mui-focused": {
                        color: "#036635",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "#036635",
                        },
                    }}
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditCategory(cat.id, newCategory)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div>
                  {cat.name}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => startEditing(cat.id)}
                  >
                    Edit
                  </Button>
                </div>
              )}
              <div>
                {" "}
                <Button
                  sx={{ marginLeft: "15px" }}
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleDeleteCategory(cat.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Grid>
  );
};

export default CreateCategory;
