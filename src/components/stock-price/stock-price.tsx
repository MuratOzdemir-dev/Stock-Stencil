import { Component, h, Host, Listen, Prop, State, Watch } from '@stencil/core'
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
  @State() isFetching = false

  @Prop({ mutable: true, reflect: true }) stockSymbol: string
  @Watch('stockSymbol')
  stockSymbolChanged(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.validUserInput = true
      this.enteredSymbol = newVal
      this.fetchStockPrice(newVal)
    }
  }

  componentWillLoad() {
    if (this.stockSymbol) {
      this.validUserInput = true
      this.enteredSymbol = this.stockSymbol
      this.fetchStockPrice(this.stockSymbol)
    }
  }
  @Listen('siuSymbolSelected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent) {
    console.log('custom event', event.detail)
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockSymbol = event.detail
    }
  }

  fetchStockPrice(symbol: string) {
    this.isFetching = true
    fetch(`https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=${symbol}&datatype=json`, {
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
        this.isFetching = false
      })
      .catch(err => {
        this.errorMessage = err.message
        this.isFetching = false
      })
  }

  enteredUserInputHandler(event: Event) {
    this.enteredSymbol = (event.target as HTMLInputElement).value
    if (this.enteredSymbol.trim().length > 0) this.validUserInput = true
    else this.validUserInput = false
  }

  async fetchStockPriceHandler(event: Event) {
    event.preventDefault()
    this.stockSymbol = this.enteredSymbol
  }

  render() {
    if (this.isFetching) return <siu-spinner />
    return (
      <Host class={this.errorMessage ? 'error' : ''}>
        <form onSubmit={this.fetchStockPriceHandler.bind(this)}>
          <input id="stock-symbol" type="text" value={this.enteredSymbol} onInput={this.enteredUserInputHandler.bind(this)} />
          <button type="submit" disabled={!this.validUserInput || this.isFetching}>
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
