import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

export type UserProfile = {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
};

export default function useUserProfile() {
  const { instance, accounts } = useMsal();
  const account: AccountInfo | undefined = accounts && accounts.length > 0 ? accounts[0] : undefined;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!account) {
      setProfile(null);
      return;
    }

    const tokenRequest = { ...loginRequest, account };

    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Try silent token acquisition first
        const resp = await instance.acquireTokenSilent(tokenRequest as any);
        const token = resp.accessToken;
        const r = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!mounted) return;
        if (!r.ok) throw new Error(`Graph request failed: ${r.status}`);
        const data = await r.json();
        setProfile({
          displayName: data.displayName,
          mail: data.mail,
          userPrincipalName: data.userPrincipalName
        });
      } catch (err) {
        // Interaction required -> try popup as fallback
        try {
          const resp = await instance.acquireTokenPopup(tokenRequest as any);
          const token = resp.accessToken;
          const r = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!mounted) return;
          if (!r.ok) throw new Error(`Graph request failed: ${r.status}`);
          const data = await r.json();
          setProfile({
            displayName: data.displayName,
            mail: data.mail,
            userPrincipalName: data.userPrincipalName
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Failed to acquire token or fetch profile", e);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [account, instance]);

  return { profile, loading };
}
