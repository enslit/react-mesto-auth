import { createContext } from 'react';
import spinner from '../images/spinner.svg';

const CurrentUserContext = createContext({
  _id: null,
  email: '',
  name: 'Загрузка...',
  about: '',
  avatar: spinner,
});

export default CurrentUserContext;
