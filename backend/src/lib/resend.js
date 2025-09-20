import "dotenv/config"
import {Resend} from 'resend';

export const resendClient = new Resend(process.env.RESEND_API);

export const sender = {
    email: process.env.EMAIL_FROM,
    name: process.env.EMAIL_FROM_NAME
}
