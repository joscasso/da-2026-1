import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Contador from './components/Contador'
import MostrarOcultar from './components/MostrarOcultar'
import TituloDinamico from './components/TituloDinamico'
import Usuarios from './components/Usuarios'
import ContadorAuto from './components/ContadorAuto'

function App() {
  return (
    <>
      <Contador /> 
      <MostrarOcultar />
      <TituloDinamico />
      <Usuarios />
      <ContadorAuto />

    </>
  )
}

export default App
