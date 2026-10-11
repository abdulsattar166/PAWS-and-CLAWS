import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, inputCls, labelCls, btnPrimary } from "./AdminUi";

function Alert({ tone, text }: { tone: "ok" | "bad"; text: string }) {
  const cls = tone === "ok" ? "bg-accent-100 text-accent-900 border-accent-200" : "bg-red-50 text-red-700 border-red-200";
  return (
    <p className={`flex items-start gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${cls}`}>
      <i className={tone === "ok" ? "ri-check-line mt-0.5" : "ri-error-warning-line mt-0.5"} aria-hidden="true"></i>
      {text}
    </p>
  );
}

export default function AdminProfile() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");
      const meta = (user.user_metadata?.display_name as string) ?? "";
      setDisplayName(meta);
      supabase
        .from("admin_users")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data: row }) => {
          const r = row as { display_name: string | null } | null;
          if (r?.display_name) setDisplayName(r.display_name);
        });
    });
  }, []);

  const saveName = async () => {
    if (!supabase || !userId) return;
    setSavingName(true);
    setNameMsg(null);
    const name = displayName.trim();
    const { error } = await supabase.from("admin_users").update({ display_name: name }).eq("user_id", userId);
    if (error) {
      setSavingName(false);
      setNameMsg({ tone: "bad", text: error.message });
      return;
    }
    await supabase.auth.updateUser({ data: { display_name: name } });
    setSavingName(false);
    setNameMsg({ tone: "ok", text: "Display name updated." });
  };

  const savePassword = async () => {
    if (!supabase) return;
    setPwMsg(null);
    if (pw1.length < 6) {
      setPwMsg({ tone: "bad", text: "Password must be at least 6 characters." });
      return;
    }
    if (pw1 !== pw2) {
      setPwMsg({ tone: "bad", text: "The two passwords don't match." });
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setSavingPw(false);
    if (error) {
      setPwMsg({ tone: "bad", text: error.message });
      return;
    }
    setPw1("");
    setPw2("");
    setPwMsg({ tone: "ok", text: "Password changed successfully." });
  };

  return (
    <div className="space-y-5 admin-fade max-w-2xl">
      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-12 h-12 rounded-2xl bg-primary-500 text-foreground-50 flex items-center justify-center">
            <i className="ri-user-settings-line text-2xl" aria-hidden="true"></i>
          </span>
          <div>
            <h3 className="font-heading text-lg text-foreground-950">Your profile</h3>
            <p className="text-sm text-foreground-600">{email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Display name</label>
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputCls} placeholder="e.g. Sarah the manager" />
          </div>
          {nameMsg && <Alert tone={nameMsg.tone} text={nameMsg.text} />}
          <button type="button" onClick={saveName} disabled={savingName} className={btnPrimary}>
            {savingName ? "Saving…" : <><i className="ri-save-line" aria-hidden="true"></i> Save display name</>}
          </button>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-12 h-12 rounded-2xl bg-accent-500 text-background-950 flex items-center justify-center">
            <i className="ri-lock-password-line text-2xl" aria-hidden="true"></i>
          </span>
          <div>
            <h3 className="font-heading text-lg text-foreground-950">Change password</h3>
            <p className="text-sm text-foreground-600">Choose a strong password you don't use elsewhere.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>New password</label>
            <input type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} className={inputCls} autoComplete="new-password" placeholder="••••••••" />
          </div>
          <div>
            <label className={labelCls}>Confirm new password</label>
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} autoComplete="new-password" placeholder="••••••••" />
          </div>
          {pwMsg && <Alert tone={pwMsg.tone} text={pwMsg.text} />}
          <button type="button" onClick={savePassword} disabled={savingPw} className={btnPrimary}>
            {savingPw ? "Updating…" : <><i className="ri-shield-check-line" aria-hidden="true"></i> Update password</>}
          </button>
        </div>
      </Card>
    </div>
  );
}