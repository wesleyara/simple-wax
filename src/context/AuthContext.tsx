import * as waxjs from "@waxio/waxjs/dist";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import AuthService from "../services/AuthService";
import { getStorage } from "../utils";

interface IAuthProvider {
  endpoint: string;
  chainId: string;
  appName: string;
  children: ReactNode;
}

interface IActiveUserData {
  accountName: string;
  requestPermission: string;
  wallet: string;
}

interface IAuthService {
  type: "wax" | "anchor";
  actions: any[];
  successFunction?: any;
  errorFunction?: any;
}

interface AuthContextProps {
  activeUserData: IActiveUserData | undefined;
  setActiveUserData: Dispatch<SetStateAction<IActiveUserData | undefined>>;
  handleWaxSignIn: () => Promise<void>;
  handleAnchorSignIn: () => Promise<void>;
  handleLogout: () => Promise<void>;
  ActionService: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({
  children,
  endpoint,
  chainId,
  appName,
}: IAuthProvider) => {
  const [activeUserData, setActiveUserData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState({
    stats: false,
    timestamp: 0,
  });
  const [now, setNow] = useState<number>(Date.now());

  const auth = new AuthService(endpoint, chainId, appName);

  const handleWaxSignIn = async () => {
    await auth.handleWaxSignIn();
    setIsLoading({
      stats: true,
      timestamp: now,
    });

    const userData = getStorage("Wax");

    setActiveUserData(userData);
  };

  const handleAnchorSignIn = async () => {
    await auth.handleAnchorSignIn();
    setIsLoading({
      stats: true,
      timestamp: now,
    });

    const userData = await getStorage("Anchor");

    setActiveUserData(userData);
  };

  const handleLogout = async () => {
    await auth.handleSignOut();

    setActiveUserData(undefined);
  };

  const setAuth = () => {
    const anchor = getStorage("Anchor");
    const wax = getStorage("Wax");

    if (wax) {
      setActiveUserData(wax);
    }

    if (anchor) {
      setActiveUserData(anchor);
    }

    if (wax || anchor) {
      setIsLoading({
        stats: false,
        timestamp: 0,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAuth();
  }, []);

  useEffect(() => {
    if (isLoading.stats) {
      setAuth();
    }
  }, [isLoading, now]);

  useEffect(() => {
    if (now - isLoading.timestamp > 30000 && isLoading.stats) {
      setIsLoading({
        stats: false,
        timestamp: 0,
      });
    }
  }, [now, isLoading]);

  const ActionService = ({
    type,
    actions,
    successFunction,
    errorFunction,
  }: IAuthService) => {
    switch (type) {
      case "wax":
        return new Promise(resolve => {
          const wax = new waxjs.WaxJS({
            rpcEndpoint: endpoint,
            tryAutoLogin: true,
          });

          wax
            .login()
            .then(() => {
              wax.api
                .transact(
                  {
                    actions,
                  },
                  {
                    blocksBehind: 3,
                    expireSeconds: 180,
                  },
                )
                .then(transactResult => {
                  successFunction();
                  resolve(transactResult);
                })
                .catch((error: any) => {
                  if (error) {
                    console.log(error);
                    errorFunction();
                  }
                });
            })
            .catch((error: any) => {
              if (error) {
                console.log(error);
                errorFunction();
              }
            });
        });
      case "anchor":
        return new Promise(resolve => {
          const auth = new AuthService(endpoint, chainId, appName);
          const anchorLink = auth?.anchorLink as any;
          return anchorLink.restoreSession(appName).then((session: any) => {
            session
              .transact(
                {
                  actions,
                },
                {
                  blocksBehind: 3,
                  expireSeconds: 180,
                },
              )
              .then((waxResponse: any) => {
                successFunction();
                resolve(waxResponse);
              })
              .catch((error: any) => {
                if (error) {
                  console.log(error);
                  errorFunction();
                }
              });
          });
        });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        activeUserData,
        setActiveUserData,
        handleAnchorSignIn,
        handleLogout,
        handleWaxSignIn,
        ActionService,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
