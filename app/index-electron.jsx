import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { Home } from './containers';
import { VideoStore, WinStore } from './stores';
import './styles/main.css';


const eventsHandler = require('electron').ipcRenderer;

const isDev = process.env.NODE_ENV !== 'production';


/* CSS Entry point */

if (module.hot && isDev) {
	/* hotmodule replacement for extracted CSS */
	const cssNode = document.getElementById('css-bundle');
	const port = process.env.PORT || 3000;
	cssNode.href = `http://localhost:${port}/dist/style.css?${Date.now()}`;
	module.hot.accept();
}


const stores = {
	video: new VideoStore({ events: eventsHandler }),
	win: new WinStore({ events: eventsHandler })
};


const App = ({ children }) => (
	<Provider {...stores}>
		{children}
	</Provider>
);

render(
	<div>
		{/* isDev && <DevTools /> */}
		<App>
			<Home/>
		</App>
	</div>,
	document.getElementById('root')
);
