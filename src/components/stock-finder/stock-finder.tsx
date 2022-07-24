import { Component, h, Host, State, Event, EventEmitter } from '@stencil/core'
import { rapidApiKey } from '../../settings/keys'

@Component({
  tag: 'siu-stock-finder',
  styleUrl: 'stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement

  @State() searchResults: { symbol: string; name: string }[] = []
  @Event({ bubbles: true, composed: true }) siuSymbolSelected: EventEmitter<string>

  findStockHandler(event: Event) {
    event.preventDefault()
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.stockNameInput.value}&apikey=${rapidApiKey}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => (this.searchResults = res.bestMatches.map(match => ({ symbol: match['1. symbol'], name: match['2. name'] }))))
      .catch(err => console.log(err))
  }

  onSelecetSymbol(symbol: string) {
    this.siuSymbolSelected.emit(symbol)
  }

  render() {
    return (
      <Host>
        <form onSubmit={this.findStockHandler.bind(this)}>
          <input type="text" ref={el => (this.stockNameInput = el)} />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {this.searchResults.map(result => (
            <li onClick={this.onSelecetSymbol.bind(this, result.symbol)}>
              <strong>{result.symbol}</strong> {result.name}
            </li>
          ))}
        </ul>
      </Host>
    )
  }
}
