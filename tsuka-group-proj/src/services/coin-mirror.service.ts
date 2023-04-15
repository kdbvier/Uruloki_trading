import axios from "axios";

const coinMirrorUrl = "https://cryptocurrencyliveprices.com";

const coinMirror = axios.create({
  baseURL: coinMirrorUrl,
  timeout: 2500,
});

export { coinMirror, coinMirrorUrl };
