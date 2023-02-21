import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Test from "./Scenes/test"
import Tema_1 from "./Tema_1_figuras"
import Tema_2 from "./Tema_2_Posicion_rotacion_escala"
import Tema_3 from './Tema_3_Camaras';
import Tema_4 from './Tema_4_Iluminacion';
import Tema_5 from './Tema_5_Materiales_texturas';
import Tema_6 from './Tema_6_Collisiones_Fisicas';
import Tema_7 from './Tema_7_Transformaciones';
import Tema_8 from './Tema_8_Acciones_Eventos'

function App() {
  return (
    <Router>
      <Routes>
          <Route exact path='/' element={<Test/>}></Route>
          <Route path='/tema_1' element={<Tema_1/>}></Route>
          <Route path='/tema_2' element={<Tema_2/>}></Route>
          <Route path='/tema_3' element={<Tema_3/>} ></Route>
          <Route path='/tema_4' element={<Tema_4/>} ></Route>
          <Route path='/tema_5' element={<Tema_5/>}></Route>
          <Route path='/tema_6' element={<Tema_6/>} ></Route>
          <Route path='/tema_7' element={<Tema_7/>} ></Route>
          <Route path='/tema_8' element={<Tema_8/>} ></Route>
      </Routes>
    </Router>
)}

export default App;
