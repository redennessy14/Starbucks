import React, { createContext } from "react";
import { db } from "../firebase";

import {
  DocumentReference,
  addDoc,
  collection,
  getDocs,
  DocumentData,
  setDoc,
  QueryDocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserI } from "./authContext";

interface ProductsContextI {
  addCategory: (categoryName: string) => void;
  deleteCategory: (id: string) => void;
  getCategories: () => Promise<Category[]>;
  editCategory: (categoryId: string, newName: string) => Promise<void>;
  addCard: (
    name: string,
    description: string,
    price: string,
    image: string,
    category: string
  ) => void;
  getCards: (category?: string, search?: string) => Promise<CardI[]>;
  addToBasket: (user: UserI, card: CardI) => void;
  getBasket: (user: UserI) => Promise<CardI[]>;
  removeFromBasketFunction: (user: any, card: CardI) => Promise<void>;
  decrementCount: (user: { uid: string }, itemId: string) => Promise<void>;
  incrementCount: (user: { uid: string }, itemId: string) => Promise<void>;
}
export interface Category {
  id: string;
  name: string;
  isEditing?: boolean;
}

export interface CardI {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  count: number;
  id?: string;
}
type DocId = string;

export const productsContext = createContext<ProductsContextI>(
  {} as ProductsContextI
);

const ProductsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const addCategory = async (categoryName: string) => {
    try {
      const docRef = await addDoc(collection(db, "category"), {
        name: categoryName,
      });
      console.log("Документ успешно создан");
    } catch (error) {
      console.error("Ошибка при создании документа:", error);
    }
  };

  const getCategories = async (): Promise<Category[]> => {
    const categoryCollection = collection(db, "category");
    const querySnapshot = await getDocs(categoryCollection);
    const categories: Category[] = [];

    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        name: doc.data().name,
      });
    });

    return categories;
  };

  const deleteCategory = async (categoryId: string): Promise<void> => {
    try {
      const categoryRef: DocumentReference = doc(db, "category", categoryId);

      await deleteDoc(categoryRef);
    } catch (error) {
      console.error(error);
    }
  };

  const editCategory = async (
    categoryId: string,
    newName: string
  ): Promise<void> => {
    const categoryDocRef = doc(db, "category", categoryId);

    try {
      await setDoc(categoryDocRef, { name: newName }, { merge: true });
    } catch (error) {
      console.error(error);
    }
  };

  const addCard = async (
    name: string,
    description: string,
    price: string,
    imageUrl: string,
    category: string
  ): Promise<void> => {
    try {
      const cardData: CardI = {
        name,
        description,
        price,
        image: imageUrl,
        category,
        count: 1,
      };

      const cardsCollection = collection(db, "cards");
      const docRef = await addDoc(cardsCollection, cardData);
      console.log("Продукт успешно создан. ID: ", docRef.id);
    } catch (error) {
      console.error(error);
    }
  };

  const getCards = async (
    category?: string,
    search?: string
  ): Promise<CardI[]> => {
    try {
      const cardsCollection = collection(db, "cards");
      const querySnapshot = await getDocs(cardsCollection);

      const cards: CardI[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const cardData = doc.data() as CardI;
        const cardId: DocId = doc.id;

        if (
          (!category || cardData.category === category) &&
          (!search ||
            cardData.name.toLowerCase().includes(search.toLowerCase()))
        ) {
          cards.push({ ...cardData, id: cardId });
        }
      });

      return cards;
    } catch (error) {
      console.error("Ошибка при получении карточек: ", error);
      throw error;
    }
  };

  const addToBasket = async (user: UserI, card: CardI) => {
    try {
      const userCartRef = doc(db, "user_carts", user.uid);
      const userCartSnapshot = await getDoc(userCartRef);

      if (userCartSnapshot.exists()) {
        const userCartData = userCartSnapshot.data() || {};
        const userBasket = userCartData[user.uid] || [];

        const cards = await getCards();

        const selectedCard = cards.find((c) => c.id === card.id);

        if (selectedCard) {
          const cardWithId = { ...selectedCard };

          userBasket.push(cardWithId);
          await setDoc(userCartRef, { [user.uid]: userBasket });
        } else {
          console.error("Выбранная карточка не найдена.");
          toast.error("Выбранная карточка не найдена.");
        }
      } else {
        console.error("Корзина пользователя не найдена.");
        toast.error("Корзина пользователя не найдена.");
      }

      console.log("Товар успешно добавлен в корзину.");
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину: ", error);
      toast.error("Необходимо войти в учетную запись");
      navigate("/sign-in");
    }
  };

  const getBasket = async (user: UserI) => {
    try {
      const userCartRef = doc(db, "user_carts", user.uid);
      const userCartSnapshot = await getDoc(userCartRef);

      if (userCartSnapshot.exists()) {
        const userCartData = userCartSnapshot.data();
        if (userCartData[user.uid]) {
          return userCartData[user.uid];
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromBasketFunction = async (user: UserI, card: CardI) => {
    try {
      const userCartRef = doc(db, "user_carts", user.uid);
      const userCartSnapshot = await getDoc(userCartRef);

      if (userCartSnapshot.exists()) {
        const userCartData = userCartSnapshot.data() || {};
        const userBasket = userCartData[user.uid] || [];

        const updatedUserBasket = userBasket.filter(
          (item: any) => item.id !== card.id
        );

        await setDoc(userCartRef, { [user.uid]: updatedUserBasket });
        console.log("Товар успешно удален из корзины.");
      }
    } catch (error) {
      console.error("Ошибка при удалении товара из корзины: ", error);
    }
  };

  const incrementCount = async (user: { uid: string }, itemId: string) => {
    try {
      const userCartRef = doc(db, "user_carts", user.uid);
      const userCartSnapshot = await getDoc(userCartRef);

      if (userCartSnapshot.exists()) {
        const userCartData = userCartSnapshot.data();
        if (userCartData && userCartData[user.uid]) {
          const userCart: CardI[] = userCartData[user.uid];
          const updatedCart = userCart.map((item) => {
            if (item.id === itemId) {
              return { ...item, count: (item.count || 0) + 1 };
            }
            return item;
          });
          await setDoc(userCartRef, { [user.uid]: updatedCart });
        }
      }
    } catch (error) {
      console.error("Ошибка при обновлении корзины: ", error);
    }
  };

  const decrementCount = async (user: { uid: string }, itemId: string) => {
    try {
      const userCartRef = doc(db, "user_carts", user.uid);
      const userCartSnapshot = await getDoc(userCartRef);

      if (userCartSnapshot.exists()) {
        const userCartData = userCartSnapshot.data();
        if (userCartData && userCartData[user.uid]) {
          const userCart: CardI[] = userCartData[user.uid];
          const updatedCart = userCart.map((item) => {
            if (item.id === itemId) {
              const updatedCount =
                (item.count || 0) > 1 ? (item.count || 0) - 1 : 1;
              return { ...item, count: updatedCount };
            }
            return item;
          });
          await setDoc(userCartRef, { [user.uid]: updatedCart });
        }
      }
    } catch (error) {
      console.error("Ошибка при обновлении корзины: ", error);
    }
  };

  return (
    <productsContext.Provider
      value={{
        addCategory,
        deleteCategory,
        getCategories,
        editCategory,
        addCard,
        getCards,
        addToBasket,
        getBasket,
        removeFromBasketFunction,
        incrementCount,
        decrementCount,
      }}
    >
      {" "}
      {children}
    </productsContext.Provider>
  );
};

export default ProductsContextProvider;
