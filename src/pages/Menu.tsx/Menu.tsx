import React, { useContext, useEffect, useState } from "react";
import { CardI, Category, productsContext } from "../../context/productContext";
import "./Menu.css";
import { useAuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { log } from "console";

const Menu = () => {
  const {
    getCards,
    getCategories,
    addToBasket,
    getBasket,
    removeFromBasketFunction,
  } = useContext(productsContext);
  const [cards, setCards] = useState<CardI[]>([]);
  const [addedToBasket, setAddedToBasket] = useState<boolean[]>([]);
  const { user } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const search = searchParams.get("title") || "";
    const fetchCards = async () => {
      try {
        const cardsData = await getCards(category, search);
        setCards(cardsData);
        navigate(`?${searchParams.toString()}`);
        setAddedToBasket(new Array(cardsData.length).fill(false));
        console.log(cardsData);
      } catch (error) {
        console.error("Ошибка при получении карточек: ", error);
      }
    };

    fetchCards();
  }, [searchParams]);

  const handleBasket = async (card: CardI, index: number) => {
    if (addedToBasket[index]) {
      await removeFromBasketFunction(user, card);
      toast.error("Product deleted from basket");
    } else {
      await addToBasket(user, card);
      toast.success("Product added to basket");
    }

    const updatedAddedToBasket = [...addedToBasket];
    updatedAddedToBasket[index] = !addedToBasket[index];
    setAddedToBasket(updatedAddedToBasket);
  };

  useEffect(() => {
    const loadUserBasket = async () => {
      if (user) {
        const userBasket = await getBasket(user);

        const updatedAddedToBasket = cards.map((card) => {
          return userBasket.some((basketItem) => basketItem.id === card.id);
        });

        setAddedToBasket(updatedAddedToBasket);
      }
    };

    loadUserBasket();
  }, [cards, getBasket, user]);

  const handleChangeCategory = (value: string) => {
    searchParams.set("category", value);
    navigate(`?${searchParams.toString()}`);
  };
  const removeCategoryFilter = () => {
    searchParams.delete("category");
    navigate("/menu", { replace: true });
  };

  return (
    <div className="menu">
      <div className="ifblock">
        <h3>Filter by Category</h3>

        {categories.map((cat) => (
          <div
            className="ifblock__filter_item"
            onClick={() => handleChangeCategory(cat.name)}
            key={cat.id}
          >
            {cat.name}
          </div>
        ))}
        <div className="ifblock__filter_item" onClick={removeCategoryFilter}>
          Remove Filter
        </div>
      </div>
      <div className="menu_block">
        {cards.map((card, index) => (
          <div key={index}>
            <div className="custom__card">
              <div className="custom__card_img">
                {" "}
                <img src={card.image} alt="" />
              </div>
              <div className="custom__card_name">{card.name} </div>
              <div> {card.description}</div>

              <div className="custom__card_price"> {card.price}$</div>

              <button
                className={`custom__card_btn ${
                  addedToBasket[index] ? "delete-button" : ""
                }`}
                onClick={() => handleBasket(card, index)}
              >
                {addedToBasket[index] ? "Delete from Basket" : "Add to Basket"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
