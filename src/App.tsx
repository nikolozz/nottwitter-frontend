import './App.css';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { setContext } from 'apollo-link-context';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Authenticated from './components/Authenticated';
import Profile from './pages/Profile';
import Home from './pages/Home';
import SingleTweet from './components/SingleTweet';

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem('Authentication');

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const link = authLink.concat(httpLink as any);

const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Authenticated>
            <Route exact path="/" component={Home} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/tweet/:id" component={SingleTweet} />
          </Authenticated>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
