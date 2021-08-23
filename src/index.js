// @ts-check
import ReactDOM from 'react-dom';
import init from './init.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const render = () => {
  const vdom = init();
  ReactDOM.render(
    vdom, document.querySelector('#chat'),
  );
};

render();

console.log('it works!');
