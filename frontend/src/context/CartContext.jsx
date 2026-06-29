import { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

/**
 * Cart reducer — manages cart items
 */
function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload, loading: false };

    case 'ADD_ITEM': {
      const exists = state.items.find(
        (i) => (i.product?._id || i.product) === action.payload.productId
      );
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            (i.product?._id || i.product) === action.payload.productId
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { product: action.payload.product, quantity: action.payload.quantity, _id: Date.now().toString() },
        ],
      };
    }

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload.itemId
            ? { ...i, quantity: action.payload.quantity }
            : i
        ).filter((i) => i.quantity > 0),
      };

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    default:
      return state;
  }
}

const LOCAL_CART_KEY = 'ecommerce_guest_cart';

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false });
  const { isAuthenticated } = useAuth();

  // Load cart — from backend if logged in, else from localStorage
  useEffect(() => {
    const loadCart = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      if (isAuthenticated) {
        try {
          const { data } = await cartAPI.get();
          dispatch({ type: 'SET_CART', payload: data.cart });
        } catch {
          dispatch({ type: 'SET_CART', payload: [] });
        }
      } else {
        const local = localStorage.getItem(LOCAL_CART_KEY);
        dispatch({ type: 'SET_CART', payload: local ? JSON.parse(local) : [] });
      }
    };
    loadCart();
  }, [isAuthenticated]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const { data } = await cartAPI.add(product._id, quantity);
        dispatch({ type: 'SET_CART', payload: data.cart });
      } catch (err) {
        throw err;
      }
    } else {
      dispatch({ type: 'ADD_ITEM', payload: { product, productId: product._id, quantity } });
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        const { data } = await cartAPI.update(itemId, quantity);
        dispatch({ type: 'SET_CART', payload: data.cart });
      } catch (err) {
        throw err;
      }
    } else {
      dispatch({ type: 'UPDATE_ITEM', payload: { itemId, quantity } });
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const { data } = await cartAPI.remove(itemId);
        dispatch({ type: 'SET_CART', payload: data.cart });
      } catch (err) {
        throw err;
      }
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clear();
      } catch { /* silent */ }
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  // Derived values
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.items.reduce((sum, i) => {
    const price = i.product?.price || 0;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
