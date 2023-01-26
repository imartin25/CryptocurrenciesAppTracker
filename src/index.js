//Import statement allows us to use React, ReactDOM and the index.css file.  
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// This line creates a root element to render our React App into. 
const root = ReactDOM.createRoot(document.getElementById('root'));

// This is an async function that calls an API and returns the data for a given token. 
async function callApi(token) {
  const endpoint = new URL("https://api.coincap.io/v2/assets")
  const response = await fetch(endpoint).then(res => res.json())
  token = token.toLowerCase()
  let match = null
  response.data.map(tkn => {
    if (token == tkn.id) {
      match = [tkn.name, tkn.symbol, Number(tkn.priceUsd).toFixed(2)]
    }
  })
  return match
}

// This is a class component that contains the React App. 
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      trackedCryptos: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.search = this.search.bind(this)
    this.delete = this.delete.bind(this)

  }
  handleChange(event) {
    this.setState({ input: event.target.value })
  }

  // This is an async function that calls the callApi function and updates the trackedCryptos state with the result which will be shown in the UI. 
  async search() {
    let crypto = await callApi(this.state.input)
    let cryptoArray = this.state.trackedCryptos
    if (crypto != null) {
      this.setState({
        trackedCryptos: [...this.state.trackedCryptos, crypto],
        input: ""
      })
    } else {
      alert("There is no cryptocurrency with that name.")
    }
  }
  // This function removes a tracked token from the trackedCryptos state and from the UI. 
  delete(event) {
    let del = event.target.parentNode.id
    let array = [...this.state.trackedCryptos]
    array.splice(del, 1)
    this.setState({
      trackedCryptos: [...array]
    })
  }
  // This is the render function which displays the App on the page. 
  render() {
    const items = this.state.trackedCryptos.map((tkn, index) => <li id={index} key={index}>{tkn[0]}({tkn[1]}) actual price is: {tkn[2]}$ <button onClick={this.delete}>X</button> </li>)
    return (
      <div id="container">
        <p id="title">Crypto Prices App</p>
        <p>Search price of any crypto:</p>
        <input type="text" value={this.state.input} onChange={this.handleChange} placeholder="Bitcoin"></input>
        <button onClick={this.search} >Search</button>
        <ul>{items}</ul>
      </div>
    )
  }
}

// This line renders the App. 
root.render(
  <App />
)
