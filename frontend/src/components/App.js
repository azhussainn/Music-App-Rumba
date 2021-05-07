import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ContextProvider } from '../Context'
import HomePage from './homepage/HomePage'



const App = () => {

    return(
        <div className='center'>
            <HomePage />
        </div>
)}

const appDiv = document.getElementById("app")
render(
    <ContextProvider>
        <Router>
            <App/>
        </Router>
    </ContextProvider>, appDiv)

export default App