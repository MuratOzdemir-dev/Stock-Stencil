import { Component, h, Host, State } from '@stencil/core'
import { rapidApiKey, rapidApiHost } from '../../settings/keys'
import { StockResData } from '../../interfaces/Stocks'

@Component({
  tag: 'siu-stock',
  shadow: true,
  styleUrl: 'stock-price.css',
})
export class StockPrice {
  @State() stockData: StockResData
  @State() enteredSymbol: string
  @State() validUserInput = false
  @State() errorMessage: string

  enteredUserInputHandler(event: Event) {
    this.enteredSymbol = (event.target as HTMLInputElement).value
    if (this.enteredSymbol.trim().length > 0) this.validUserInput = true
    else this.validUserInput = false
  }

  async fetchStockPriceHandler(event: Event) {
    event.preventDefault()
    fetch(`https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=${this.enteredSymbol}&datatype=json`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': rapidApiHost,
      },
    })
      .then(response => response.json())
      .then(response => {
        if (!response['Global Quote']['05. price']) throw new Error('Price not found!')
        this.stockData = { ...response }
        this.errorMessage = null
      })
      .catch(err => (this.errorMessage = err.message))
  }

  render() {
    return (
      <Host>
        <form onSubmit={this.fetchStockPriceHandler.bind(this)}>
          <input id="stock-symbol" type="text" value={this.enteredSymbol} onInput={this.enteredUserInputHandler.bind(this)} />
          <button type="submit" disabled={!this.validUserInput}>
            Submit
          </button>
        </form>
        <main class="content">
          <p>Price: ${this.stockData ? this.stockData['Global Quote']['05. price'] : 0}</p>
          {this.errorMessage && <p>{this.errorMessage}</p>}
        </main>
      </Host>
    )
  }
}
