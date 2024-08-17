import {getIsLoading, getProductsAll} from '../redux/products/productsSlice';
import {useAppSelector} from '../redux/hooks';
import {filterByCategory} from '../helpers/filterByCategory';
import {PagesWrapper} from '../components/PagesWrapper/PagesWrapper';
import Loader from '../components/Loader/Loader';
import {ProductsList} from '../components/ProductsList/ProductsList';

export function AppetizersScreen() {
  const products = useAppSelector(getProductsAll);
  const isLoading = useAppSelector(getIsLoading);
  const appetizers = filterByCategory(products, 'appetizers');

  return (
    <PagesWrapper>
      {isLoading && <Loader />}
      <ProductsList data={appetizers} />
    </PagesWrapper>
  );
}
