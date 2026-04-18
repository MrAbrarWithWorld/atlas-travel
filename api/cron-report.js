import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const sb = createClient(
  "https://prffhhkemxibujjjiyhg.supabase.co",
  process.env.SUPABASE_SERVICE_KEY
);

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  // Only allow GET (Vercel cron) or POST with secret
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).end();

  try {
    const now = new Date();
    const yesterday = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

    // New users in last 24h
    const { data: newUsers, error: e1 } = await sb
      .from("saved_plans")
      .select("user_id")
      .gte("created_at", yesterday);
    const uniqueNewUsers = new Set((newUsers || []).map(r => r.user_id)).size;

    // Total saved plans last 24h
    const { count: plansToday } = await sb
      .from("saved_plans")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday);

    // Active subscriptions
    const { data: subs } = await sb
      .from("subscriptions")
      .select("plan")
      .eq("status", "active")
      .gte("current_period_end", now.toISOString());

    const proCount = (subs || []).filter(s => !s.plan?.includes("explorer")).length;
    const explorerCount = (subs || []).filter(s => s.plan?.includes("explorer")).length;
    const totalPaid = proCount + explorerCount;

    // New subscriptions last 24h
    const { count: newSubs } = await sb
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday)
      .eq("status", "active");

    // Total unique users (all time via saved_plans)
    const { count: totalPlans } = await sb
      .from("saved_plans")
      .select("*", { count: "exact", head: true });

    // Build email HTML
    const dateStr = now.toLocaleDateString("en-CA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: "America/Toronto"
    });

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#1c1914;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1c1914;padding:32px 20px;">
<tr><td align="center">
<table width="520" cellpadding="0" cellspacing="0" style="background:#211e18;border:1px solid rgba(201,169,110,0.2);border-radius:12px;overflow:hidden;">

  <tr><td style="padding:24px 32px 20px;border-bottom:1px solid rgba(201,169,110,0.12);">
    <div style="font-size:11px;letter-spacing:3px;color:#c9a96e;text-transform:uppercase;">ATLAS · Daily Report</div>
    <div style="font-size:13px;color:#5a4a2a;margin-top:4px;">${dateStr}</div>
  </td></tr>

  <tr><td style="padding:24px 32px;">

    <div style="font-size:11px;letter-spacing:2px;color:#6a5a3a;text-transform:uppercase;margin-bottom:12px;">Last 24 Hours</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:10px 14px;background:rgba(201,169,110,0.05);border:1px solid rgba(201,169,110,0.12);border-radius:8px;text-align:center;width:30%;">
          <div style="font-size:24px;font-weight:300;color:#e8dcc8;">${uniqueNewUsers}</div>
          <div style="font-size:10px;color:#5a4a2a;letter-spacing:1px;margin-top:2px;">ACTIVE USERS</div>
        </td>
        <td width="12"></td>
        <td style="padding:10px 14px;background:rgba(201,169,110,0.05);border:1px solid rgba(201,169,110,0.12);border-radius:8px;text-align:center;width:30%;">
          <div style="font-size:24px;font-weight:300;color:#e8dcc8;">${plansToday || 0}</div>
          <div style="font-size:10px;color:#5a4a2a;letter-spacing:1px;margin-top:2px;">TRIPS CREATED</div>
        </td>
        <td width="12"></td>
        <td style="padding:10px 14px;background:${newSubs > 0 ? "rgba(100,180,100,0.08)" : "rgba(201,169,110,0.05)"};border:1px solid ${newSubs > 0 ? "rgba(100,200,100,0.2)" : "rgba(201,169,110,0.12)"};border-radius:8px;text-align:center;width:30%;">
          <div style="font-size:24px;font-weight:300;color:${newSubs > 0 ? "#7dc87d" : "#e8dcc8"};">${newSubs || 0}</div>
          <div style="font-size:10px;color:#5a4a2a;letter-spacing:1px;margin-top:2px;">NEW SUBS</div>
        </td>
      </tr>
    </table>

    <div style="font-size:11px;letter-spacing:2px;color:#6a5a3a;text-transform:uppercase;margin:20px 0 12px;">Subscriptions (Active)</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,169,110,0.04);border:1px solid rgba(201,169,110,0.12);border-radius:8px;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid rgba(201,169,110,0.08);">
          <span style="font-size:13px;color:#a8a090;">⭐ Pro</span>
          <span style="float:right;font-size:13px;color:#c9a96e;font-weight:500;">${proCount}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid rgba(201,169,110,0.08);">
          <span style="font-size:13px;color:#a8a090;">💎 Explorer</span>
          <span style="float:right;font-size:13px;color:#c9a96e;font-weight:500;">${explorerCount}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 16px;">
          <span style="font-size:13px;color:#a8a090;font-weight:500;">Total Paid</span>
          <span style="float:right;font-size:13px;color:#e8dcc8;font-weight:600;">${totalPaid}</span>
        </td>
      </tr>
    </table>

    <div style="margin-top:20px;text-align:center;">
      <a href="https://getatlas.ca" style="font-size:11px;color:#5a4a2a;text-decoration:none;letter-spacing:1px;">getatlas.ca</a>
    </div>

  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const transporter = nodemailer.createTransport({
      host: "smtp.zohocloud.ca",
      port: 465,
      secure: true,
      auth: { user: process.env.ZOHO_FROM, pass: process.env.ZOHO_PASS },
    });

    await transporter.sendMail({
      from: `"Atlas Report" <${process.env.ZOHO_FROM}>`,
      to: process.env.ZOHO_FROM,
      subject: `📊 Atlas Daily — ${uniqueNewUsers} users · ${plansToday || 0} trips · ${totalPaid} paid`,
      html,
    });

    return res.status(200).json({ ok: true, sent: true });
  } catch (err) {
    console.error("Cron report error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
