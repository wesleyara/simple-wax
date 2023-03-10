<h1 align="center" title="Vite Helper">
  simple-wax
</h1>

<h2 align="center">A library for simplifies WAX + React integration.</h2>

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)
[![npm version](https://img.shields.io/npm/v/simple-wax.svg?style=flat-square)](https://www.npmjs.com/package/simple-wax)
[![npm downloads](https://img.shields.io/npm/dm/simple-wax.svg?style=flat-square)](http://npm-stat.com/charts.html?package=cz-conventional-changelog&from=2015-08-01) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section --> [![All Contributors](https://img.shields.io/badge/all_contributors-2-green.svg?style=flat-square)](#contributors-) <!-- ALL-CONTRIBUTORS-BADGE:END -->

<h4 align="center">
 <a href="#-how-use">:rocket: How use</a> •
 <a href="#️-tools">🛠️ Tools</a> •
 <a href="#-contributing">:pencil: Contributing</a> •
 <a href="#-thanks">:adult: Thanks</a> •
 <a href="#-license">:page_facing_up: License</a>
</h4>

<br>

# :rocket: How use

Instalation:

```bash
npm install simple-wax@latest
#or
yarn add simple-wax@latest
```

Answer the questions (When choosing the tool, use the arrows keys to navigate, the spacebar to select and enter to finish)

---

Start integration adding the _AuthProvider_ component to your application:

```js
import { AuthProvider } from "simple-wax";
import App from "./App";

const endpoint = "http://wax-testnet.cryptolions.io/";
const chainId =
  "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12";
const appName = "simple-wax";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider endpoint={endpoint} chainId={chainId} appName={appName}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

```

Now you can use the _useAuth_ hook to get the user data:

```js
import { useAuth } from "simple-wax";

const App = () => {
  const { activeUserData, handleAnchorSignIn, handleWaxSignIn, handleLogout } = useAuth();

  return (
    <div>
      <h1>Simple Wax</h1>
      <button onClick={handleWaxSignIn}>WAX Login</button>
      <button onClick={handleAnchorSignIn}>Anchor Login</button>
      <button onClick={handleLogout}>Logout</button>
      <p>{JSON.stringify(activeUserData)}</p>
    </div>
  );
};
```

For dispatching actions, you can use the _ActionSevice_ method:

```js
import { useAuth } from "simple-wax";

const App = () => {
  const { activeUserData, ActionService } = useAuth();

  const handleBuy = () => {
    const authorization = [
      {
        actor: activeUserData?.accountName,
        permission: activeUserData?.requestPermission,
      },
    ];

    const action = {
      //... add action account and name
      authorization,
      //... add action data
    }

    ActionService({
    type: activeUserData?.wallet,
    actions: [action],
  });
  }

  return (
    <div>
      <h1>Simple Wax</h1>
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
};
```


# :pencil: Contributing

Your contribution to the `simple-wax` is essential for the evolution of the project, you can do it as follows:

- Open an [issue](https://github.com/wesleyara/simple-wax/issues) to clear doubts, report bugs or give ideas
- Open a [pull request](https://github.com/wesleyara/simple-wax/pulls) to give ideas for code improvement, implementation of new features and bug fixes

These are just some of the ways you can contribute to the project read the [CONTRIBUTING](https://github.com/wesleyara/simple-wax/blob/main/.github/CONTRIBUTING.md) for more information

# :adult: Authors

<table>
  <tr>
    <td align="center"><a href="https://wesleyaraujo.dev/"><img src="https://avatars.githubusercontent.com/u/89321125?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Wesley Araújo</b></sub></a><br /></td>
  </tr>
</table>

## ✨ Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

# :page_facing_up: License

simple-wax is a open source project licensed as [MIT](LICENSE).

```

```