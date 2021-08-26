import { useContext } from 'react';

import apiContext from '../contexts/apiContext.jsx';

const useApi = () => useContext(apiContext);

export default useApi;
