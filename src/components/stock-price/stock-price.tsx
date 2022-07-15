import { Component, h, Host, State } from '@stencil/core';
import { rapidApiKey, rapidApiHost } from '../../settings/keys';

interface StockData {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
}

interface StockResData {
  'Global Quote': StockData;
}

@Component({
  tag: 'siu-stock',
  shadow: true,
  styleUrl: 'stock-price.css',
})
export class StockPrice {
  @State() stockData: StockResData;

  async fetchStockPriceHandler(event: Event) {
    event.preventDefault();
    try {
      fetch('https://alpha-vantage.p.rapidapi.com/query?function=GLOBAL_QUOTE&symbol=MSFT&datatype=json', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': rapidApiHost,
        },
      })
        .then(response => response.json())
        .then(response => {
          this.stockData = { ...response };
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Host>
        <form onSubmit={this.fetchStockPriceHandler.bind(this)}>
          <input id="stock-symbol" type="text" />
          <button type="submit">Submit</button>
        </form>
        <main class="content">
          <p>Price: ${this.stockData ? this.stockData['Global Quote']['05. price'] : 0}</p>
        </main>
      </Host>
    );
  }
}
