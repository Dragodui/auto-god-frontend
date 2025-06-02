import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './providers/AuthProvider';
import PublicRoute from './routes/PublicRoute';
import Profile from './pages/Profile';
import Header from './components/Header';
import Topics from './pages/Topics';
import News from './pages/News';
import Topic from './pages/Topic';
import CreateNews from './pages/CreateNews';
import CreatePost from './pages/CreatePost';
import NotFound from './pages/404';
import SingleNews from './pages/SingleNews';
import SinglePost from './pages/SinglePost';
import Posts from './pages/Posts';
import ItemList from './pages/Market';
import ItemDetail from './components/ItemDetail';
import CreateItem from './components/CreateItem';
import ChatsPage from './pages/ChatsPage';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Event from './pages/Event';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            {/* public routes (only if not authenticated) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            {/* private routes (only if authenticated) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/me" element={<Profile />} />
              <Route path="/create-news" element={<CreateNews />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/create-item" element={<CreateItem />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/market/chats" element={<ChatsPage />} />
              <Route path="/market/chats/:chatId" element={<ChatsPage />} />
            </Route>
            {/* public routes */}
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/news" element={<News />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/market" element={<ItemList />} />
            <Route path="/events" element={<Events />} />

            <Route path="/market/:id" element={<ItemDetail />} />
            <Route path="/topics/:topicName" element={<Topic />} />
            <Route path="/news/:newsId" element={<SingleNews />} />
            <Route path="/posts/:postId" element={<SinglePost />} />
            <Route path="/events/:id" element={<Event />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;