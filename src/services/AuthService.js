/* eslint-disable no-undef */
import * as waxjs from "@waxio/waxjs/dist";
import AnchorLink, { APIError } from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";
import { IdentityProof } from "eosio-signing-request";
import Cookies from "js-cookie";

import { getStorage, rpcEndpoint } from "../utils";

class AuthService {
  constructor(endpoint, chainId, appName) {
    const selectedEndpoint = rpcEndpoint(endpoint);
    this.anchorLink = new AnchorLink({
      chains: [
        {
          chainId,
          nodeUrl: selectedEndpoint,
        },
      ],
      transport: new AnchorLinkBrowserTransport({}),
    });

    this.appName = appName;
    this.endpoint = endpoint;
  }

  endpoint = () => {
    return this.endpoint;
  };

  appName = () => {
    return this.appName;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anchorLink = async () => {
    return this.anchorLink;
  };

  verifyProof = async identity => {
    const proof = IdentityProof.from(identity.proof);
    let account;
    try {
      account = await this.anchorLink.client.v1.chain.get_account(
        proof.signer.actor,
      );
    } catch (error) {
      if (error instanceof APIError && error.code === 0) {
        throw new Error("No such account");
      } else {
        throw error;
      }
    }
    const auth = account.getPermission(proof.signer.permission).required_auth;
    const valid = proof.verify(auth, account.head_block_time);
    if (!valid) {
      throw new Error("Proof invalid or expired");
    }
    const proofKey = proof.recover();
    return {
      account,
      proof,
      proofKey,
      proofValid: valid,
    };
  };

  handleAnchorSignIn = async () => {
    this.anchorLink
      .login(this.appName)
      .then(identity => {
        this.verifyProof(identity)
          .then(account => {
            if (account && identity) {
              // const callback = new URL(window.location).searchParams.get('u') || '/collection';
              const anchorSessions = AuthService.getAnchorSessions();
              const json = JSON.parse(anchorSessions);

              const anchorSession = JSON.parse(json[0].value);

              const AnchorWallet = {
                accountName: anchorSession.data.auth.actor,
                requestPermission: anchorSession.data.auth.permission,
                wallet: "anchor",
              };

              if (getStorage("Wax")) {
                localStorage.removeItem("Wax");
              }

              if (getStorage("Anchor")) {
                localStorage.removeItem("Anchor");
              }

              localStorage.setItem("Anchor", JSON.stringify(AnchorWallet));
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleWaxSignIn = async () => {
    try {
      const wax = new waxjs.WaxJS({
        rpcEndpoint: this.endpoint,
        tryAutoLogin: true,
      });
      wax.login().then(account => {
        // const callback = new URL(window.location).searchParams.get('u') || '/collection'
        const WaxWallet = {
          accountName: account,
          requestPermission: "active",
          wallet: "wax",
        };

        if (getStorage("Anchor")) {
          localStorage.removeItem("Anchor");
        }

        if (getStorage("Wax")) {
          localStorage.removeItem("Wax");
        }

        localStorage.setItem("Wax", JSON.stringify(WaxWallet));
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleSignOut = async () => {
    try {
      if (getStorage("Anchor")) {
        localStorage.removeItem("Anchor");
      }
      if (getStorage("Wax")) {
        localStorage.removeItem("Wax");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // handleConnectDiscord = async () => {
  //     try {
  //         var fullRedirectUrl = encodeURIComponent(constants.nextauth_url + redirect_path);
  //         res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${constants.discord_client_id}&scope=identify&response_type=code&redirect_uri=${fullRedirectUrl}`);
  //     } catch (error) {
  //         res.status(500).json(error);
  //     }
  // }

  static setAnchorCookie = (domain, url) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes("anchor-link")) {
        const now = new Date();
        const time = now.getTime();
        const expireMins = 10;
        const expireTime = time + 1000 * (expireMins * 60);
        now.setTime(expireTime);

        const options = {
          sameSite: "lax",
          path: "/",
          domain,
          secure: url.includes("https://"),
          expires: now,
        };
        const value = localStorage.getItem(key);
        Cookies.set(
          decodeURIComponent(key),
          decodeURIComponent(value),
          options,
        );
      }
    }
  };

  static getAnchorSessions = () => {
    const anchorSessions = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes("anchor-link")) {
        const value = localStorage.getItem(key);
        anchorSessions.push({
          key,
          value,
        });
      }
    }
    return JSON.stringify(anchorSessions);
  };
}

export default AuthService;
