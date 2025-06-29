import './App.css';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { useTabs } from './hooks/store';

const App = () => {
	const { activeTab } = useTabs();

	return (
		<>
			<Header />
			<main className="content">
				<Layout id={activeTab} tabId={activeTab} key={activeTab} />
			</main>
			<Footer />
		</>
	);
};

export default App;
