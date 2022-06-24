import './App.css';
import Dashboard from './Dashboard';
import NewCar from './NewCar';
import Login from './Login';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/'>
          <Route index element={<Dashboard />} />
          <Route path='new' element={<NewCar />} />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
