import { lazy } from 'react';
import './App.css';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { useTabs } from './hooks/store';

const Todo = lazy(() => import('./modules/todo'));
const SVG = lazy(() => import('./modules/svg'));
const Encoder = lazy(() => import('./modules/encoder'));
const Decoder = lazy(() => import('./modules/decoder'));
const Embed = lazy(() => import('./modules/embed'));
const Youtube = lazy(() => import('./modules/youtube'));

const appMap = {
	todo: Todo,
	svg: SVG,
	encoder: Encoder,
	decoder: Decoder,
	embed: Embed,
	youtube: Youtube,
};

const App = () => {
	const { activeTab } = useTabs();

	return (
		<>
			<Header />
			<main className="content">
				<Layout id={activeTab} tabId={activeTab} key={activeTab} appMap={appMap} />
			</main>
			<Footer />
		</>
	);
};

export default App;
