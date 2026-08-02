import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordLink(email, token) {
    const FRONTEND_URL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try { 
        await resend.emails.send({
            from: "Password Reset Submission <oboarding@resend.dev>",
            to: email,
            subject: "Password reset link. (expires in 5 minutes)",
            html: `
                <div style="background-color:#0f0f0f;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
                    <div style="max-width:600px;margin:0 auto;background:#1a1a1a;border:1px solid #2b2b2b;border-radius:12px;padding:40px;text-align:center;">

                        <h1 style="margin:0;color:#ffffff;font-size:28px;">
                            Password Reset
                        </h1>

                        <p style="margin:20px 0;color:#cfcfcf;font-size:16px;line-height:1.6;">
                            We received a request to reset the password for your account.
                        </p>

                        <p style="margin:0 0 30px;color:#cfcfcf;font-size:16px;line-height:1.6;">
                            Click the button below to choose a new password. This link will expire in
                            <strong style="color:#00ff66;">5 minutes</strong>.
                        </p>

                        <a
                            href="${FRONTEND_URL}"
                            style="
                                display:inline-block;
                                background:#00d65a;
                                color:#ffffff;
                                text-decoration:none;
                                padding:14px 32px;
                                border-radius:8px;
                                font-size:16px;
                                font-weight:bold;
                            "
                        >
                            Reset Password
                        </a>

                        <p style="margin:30px 0 0;color:#8a8a8a;font-size:14px;line-height:1.6;">
                            If you didn't request a password reset, you can safely ignore this email.
                            Your password will remain unchanged.
                        </p>

                        <hr style="border:none;border-top:1px solid #333;margin:40px 0;">

                        <p style="margin:0;color:#666;font-size:12px;">
                            This password reset link was requested for your account.
                        </p>

                    </div>
                </div>
            `,
        });
    } catch(err) {
        throw err;
     };
};

export async function sendNewsletterVerification(email, token) {
    const FRONTEND_URL = `${process.env.FRONTEND_URL}/newsletter-email-verification?token=${token}`;

    try {
        await resend.emails.send({
            from: "Newsletter Email Verification Submission <onboarding@resend.dev>",
            to: email,
            subject: "Email verification link. (expires in 30 minutes)",
            html: `
                <div style="background-color:#0b0b0b;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
                    <div style="max-width:600px;margin:0 auto;background:#161616;border:1px solid #292929;border-radius:16px;padding:40px;text-align:center;">

                        <div style="margin-bottom:30px;">
                            <div style="
                                display:inline-block;
                                background:#00d65a;
                                color:#0b0b0b;
                                width:48px;
                                height:48px;
                                line-height:48px;
                                border-radius:50%;
                                font-size:24px;
                                font-weight:bold;
                            ">
                                ✓
                            </div>
                        </div>

                        <h1 style="
                            margin:0 0 16px;
                            color:#ffffff;
                            font-size:28px;
                            font-weight:700;
                        ">
                            Verify your email
                        </h1>

                        <p style="
                            margin:0 0 20px;
                            color:#cfcfcf;
                            font-size:16px;
                            line-height:1.6;
                        ">
                            Thanks for subscribing to our newsletter.
                            Please verify your email address to complete your subscription.
                        </p>

                        <a
                            href="${FRONTEND_URL}"
                            style="
                                display:inline-block;
                                background:#00d65a;
                                color:#08110b;
                                text-decoration:none;
                                padding:14px 36px;
                                border-radius:10px;
                                font-size:16px;
                                font-weight:700;
                                margin:10px 0 25px;
                            "
                        >
                            Verify Email
                        </a>

                        <p style="
                            margin:0 0 25px;
                            color:#999999;
                            font-size:14px;
                            line-height:1.6;
                        ">
                            This verification link will expire in
                            <strong style="color:#00ff66;">30 minutes</strong>.
                        </p>

                        <div style="
                            background:#101010;
                            border:1px solid #262626;
                            border-radius:10px;
                            padding:15px;
                            margin-bottom:30px;
                        ">
                            <p style="
                                margin:0 0 8px;
                                color:#888888;
                                font-size:12px;
                            ">
                                Button not working?
                            </p>

                            <p style="
                                margin:0;
                                color:#00d65a;
                                font-size:12px;
                                word-break:break-all;
                            ">
                                ${FRONTEND_URL}
                            </p>
                        </div>

                        <p style="
                            margin:0 0 30px;
                            color:#777777;
                            font-size:13px;
                            line-height:1.6;
                        ">
                            If you did not request this subscription, you can safely ignore this email.
                            Your email address will not be added to our newsletter.
                        </p>

                        <hr style="
                            border:none;
                            border-top:1px solid #2b2b2b;
                            margin:35px 0;
                        ">

                        <p style="
                            margin:0;
                            color:#666666;
                            font-size:12px;
                            line-height:1.5;
                        ">
                            This email was sent because a newsletter subscription was requested
                            using this email address.
                        </p>

                    </div>
                </div>
            `
        })
    } catch(err) {
        console.log(err);

        throw err;
    }
};

export async function emailTemplate(email, token, title, desc) {
    const UNSUBSCRIBE_URL = `${process.env.PORT}/api/newsletter-unsubscribe?token=${token}`;

    try {
        await resend.emails.send({
            from: "Cloth (Newsletter) <onboarding@resend.dev>",
            to: email,
            subject: title,
            headers: {
                "List-Unsubscribe": `<${UNSUBSCRIBE_URL}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
            },
            html: `
                API can be tested with the command: curl -X POST "http://localhost:3000/api/newsletter-unsubscribe?token=${token}"

                <div style="background-color:#0b0b0b;padding:40px 20px;font-family:Arial,Helvetica,sans-serif;">
                    <div style="
                        max-width:600px;
                        margin:0 auto;
                        background:#161616;
                        border:1px solid #292929;
                        border-radius:16px;
                        padding:40px;
                        text-align:center;
                    ">

                        <h1 style="
                            margin:0 0 20px;
                            color:#ffffff;
                            font-size:28px;
                            font-weight:700;
                        ">
                            ${title}
                        </h1>

                        <p style="
                            margin:0 0 30px;
                            color:#cfcfcf;
                            font-size:16px;
                            line-height:1.6;
                        ">
                            ${desc}
                        </p>

                        <!-- Newsletter Content -->
                        <div style="
                            text-align:left;
                            background:#101010;
                            border:1px solid #262626;
                            border-radius:10px;
                            padding:25px;
                            margin-bottom:30px;
                            color:#d0d0d0;
                            font-size:15px;
                            line-height:1.7;
                        ">
                            Here is what's new at Cloth this week.
                            <br><br>
                            Add your newsletter content here.
                        </div>

                        <p style="
                            margin:30px 0 0;
                            color:#777777;
                            font-size:13px;
                            line-height:1.6;
                        ">
                            You are receiving this email because you subscribed
                            to the Cloth newsletter.
                        </p>

                        <hr style="
                            border:none;
                            border-top:1px solid #2b2b2b;
                            margin:35px 0;
                        ">

                        <p style="
                            margin:0;
                            color:#666666;
                            font-size:12px;
                            line-height:1.5;
                        ">
                            If you no longer wish to receive these emails,
                            click the unsubscribe button above.
                        </p>

                    </div>
                </div>
            `
        });
    } catch(err) {
        throw err;
    }
}