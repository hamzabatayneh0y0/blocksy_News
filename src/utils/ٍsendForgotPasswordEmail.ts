import { transporter } from "@/lib/nodeMailer";
import { DOMAIN } from "./constants";


export async function sendForgotPasswordEmail(
  email: string,
  token: string
) {


  console.log("--------------------------------------------------")
console.log("sendForgotPasswordEmail-transporter:",await transporter.verify())
    
const res=await transporter.sendMail({
  from: `"Blocksy News" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Verify your email",
 html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Verify your email address</h2>

    <p>
      Thanks for creating an account with Blocksy News.
      Please click the button below to verify your email address.
    </p>

    <a 
      href="${DOMAIN}/auth/reset-password?token=${token}"
      style="
        display: inline-block;
        padding: 12px 24px;
        background-color: #2563eb;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        margin: 10px 0;
      "
    >
      Verify Email
    </a>

    <p>
      This link will expire in a 2 minutes. 
    </p>

    <p>
      Thanks,<br/>
      Blocksy News Team
    </p>
  </div>
`,
});


    return res
}

