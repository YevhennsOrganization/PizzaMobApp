import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { options } from '../../../options';
import { addItem } from '../../../redux/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  addToFavoriteAction,
  getFavorites,
  removeFromFavoriteAction,
} from '../../../redux/products/productsSlice';
import { ProductDescription } from './components/ProductDescription';
import { ProductFooter } from './components/ProductFooter';
import { ProductOptionsList } from './components/ProductOptionsList';
import { ProductQuantity } from './components/ProductQuantity';

interface ProductListItemProps {
  item: Product;
  checkIsFavoriteProducts: (_id: string) => boolean;
}

export function ProductListItem({
  item,
  checkIsFavoriteProducts,
}: ProductListItemProps) {
  const { _id, price, promotion, promPrice, category, vegan } = item;

  const [totalPrice, setTotalPrice] = useState(price);
  const [totalPromPrice, setTotalPromPrice] = useState(promPrice);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(checkIsFavoriteProducts(_id));
  const [optionsShown, setOptionsShown] = useState(false);
  const [optionsArray, setOptionsArray] = useState<Option[]>([]);
  const [optionsSum, setOptionsSum] = useState(0);

  const favoriteProducts = useAppSelector(getFavorites);

  const dispatch = useAppDispatch();

  const getTotalQuantity = (quantity: number) => {
    setTotalQuantity(quantity);
    setTotalPrice((price + optionsSum) * quantity);
    setTotalPromPrice((promPrice + optionsSum) * quantity);
  };

  const addToFavorite = () => {
    if (favoriteProducts.some(item => item._id === _id)) {
      setIsFavorite(false);
      dispatch(removeFromFavoriteAction(_id));
      Toast.show({
        type: 'info',
        text1: 'Видалено з улюблених',
        visibilityTime: 1500,
      });
    } else {
      setIsFavorite(true);
      dispatch(addToFavoriteAction(item));
      Toast.show({
        type: 'success',
        text1: 'Додано в улюблені',
        visibilityTime: 1500,
      });
    }
  };

  const optionsTitles = optionsArray.map(item => item.title);

  const addToCart = () => {
    const { photo, title, _id } = item;
    const cartItem = {
      _id: _id,
      photo: photo,
      title: title,
      quantity: totalQuantity,
      optionsTitles: optionsTitles,
      totalPrice: promotion ? totalPromPrice : totalPrice,
    };
    dispatch(addItem(cartItem));
    Toast.show({
      type: 'success',
      text1: 'Додано до кошика',
      visibilityTime: 1500,
    });
  };

  const handleShowOptions = () => {
    setOptionsShown(!optionsShown);
  };

  const handleChooseOptions = (title: string, isChecked: boolean) => {
    const optionData = options.find(item => item.title === title);

    if (optionData !== undefined) {
      if (isChecked && !optionsArray.includes(optionData)) {
        setOptionsArray([...optionsArray, optionData]);
        setOptionsSum(optionsSum + optionData.price);
      }
      if (!isChecked && optionsArray.includes(optionData)) {
        const filteredArray = optionsArray.filter(item => item !== optionData);
        setOptionsArray(filteredArray);
        setOptionsSum(optionsSum - optionData.price);
      }
    }
  };

  useEffect(() => {
    !optionsShown && setOptionsArray([]), setOptionsSum(0);
  }, [optionsShown]);

  return (
    <View style={styles.listItem}>
      <ProductDescription
        item={item}
        isFavorite={isFavorite}
        addToFavorite={addToFavorite}
      />
      <ProductQuantity
        getTotalQuantity={getTotalQuantity}
        handleChange={handleShowOptions}
        options={options}
        category={category}
      />
      {optionsShown && (
        <ProductOptionsList
          options={options}
          handleChange={handleChooseOptions}
          vegan={vegan}
        />
      )}
      <ProductFooter
        promotion={promotion}
        totalPrice={totalPrice}
        totalPromPrice={totalPromPrice}
        addToCart={addToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    backgroundColor: '#fff',
    color: 'black',
    padding: 24,
    borderRadius: 10,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
});
