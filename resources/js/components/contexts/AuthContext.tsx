import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { User, Client, AuthContextType } from "../../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [client, setClient] = useState<Client | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    // Load user and client information on mount
    useEffect(() => {
        const loadUserAndClient = async () => {
            if (token) {
                console.log("Token found, loading user and client info");
                try {
                    // First load user info
                    const userResponse = await fetch("/api/me", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        console.log("User data loaded:", userData);
                        setUser(userData.user);

                        // Then load client info
                        const clientResponse = await fetch("/api/client-info", {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: "application/json",
                            },
                        });

                        console.log(
                            "Client info response status:",
                            clientResponse.status
                        );

                        if (clientResponse.ok) {
                            const clientData = await clientResponse.json();
                            console.log("Client info data:", clientData);
                            if (clientData.client) {
                                setClient(clientData.client);
                            }
                        } else {
                            const errorData = await clientResponse.json();
                            console.error("Client info error:", errorData);
                        }
                    } else {
                        console.error(
                            "Failed to load user info, clearing token"
                        );
                        setToken(null);
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Failed to load user/client info:", error);
                }
            } else {
                console.log("No token available");
            }
        };

        loadUserAndClient();
    }, [token]);

    // Function to set client cookies (legacy - for backward compatibility)
    const setClientCookies = (clientData: Client) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Note: The secure cookie is now set by the server
        // These are kept for backward compatibility and debugging
        document.cookie = `client_id=${
            clientData.id
        }; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        document.cookie = `client_name=${encodeURIComponent(
            clientData.name
        )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        document.cookie = `client_email=${
            clientData.email
        }; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    };

    // Function to get client cookies
    const getClientCookies = (): Client | null => {
        const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        if (cookies.client_id && cookies.client_name) {
            return {
                id: parseInt(cookies.client_id),
                name: decodeURIComponent(cookies.client_name),
                email: cookies.client_email || "",
            };
        }
        return null;
    };

    // Function to clear client cookies
    const clearClientCookies = () => {
        // Clear legacy cookies
        document.cookie =
            "client_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
            "client_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
            "client_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        // Note: Secure client_data cookie is cleared by server on logout
    };

    // Function to log all cookies
    const logCookies = () => {
        console.log("🍪 === COOKIE CONTENTS ===");
        console.log("All cookies:", document.cookie);

        if (document.cookie) {
            const cookies = document.cookie.split(";").reduce((acc, cookie) => {
                const [key, value] = cookie.trim().split("=");
                acc[key] = value;
                return acc;
            }, {} as Record<string, string>);

            console.log("Parsed cookies:", cookies);

            // Log specific Laravel cookies
            Object.keys(cookies).forEach((cookieName) => {
                if (
                    cookieName.includes("laravel") ||
                    cookieName.includes("session") ||
                    cookieName.includes("sanctum") ||
                    cookieName.includes("csrf")
                ) {
                    console.log(`🔑 ${cookieName}:`, cookies[cookieName]);
                }
            });
        } else {
            console.log("No cookies found");
        }

        console.log("📱 Local Storage token:", localStorage.getItem("token"));
        console.log("👤 Current user:", user);
        console.log("🏢 Current client:", client);
        console.log("🔐 Current token:", token);
        console.log("🍪 === END COOKIE LOG ===");
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem("token", data.token);

                // Set client information and cookies
                if (data.client) {
                    setClient(data.client);
                    setClientCookies(data.client);
                }

                // Log cookies after successful login
                setTimeout(() => {
                    logCookies();
                }, 100); // Small delay to ensure cookies are set

                return { success: true };
            } else {
                return {
                    success: false,
                    errors: data.errors || { email: [data.message] },
                };
            }
        } catch (error) {
            return { success: false, errors: { email: ["Network error"] } };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await fetch("/api/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
            setClient(null);
            setToken(null);
            localStorage.removeItem("token");
            clearClientCookies();
        }
    };

    const value: AuthContextType = {
        user,
        client,
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
