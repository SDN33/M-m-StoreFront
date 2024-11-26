// pages/api/user-email.js
import { getCookie } from 'cookies-next';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const userEmail = getCookie('userEmail', { req, res });

    if (userEmail) {
      return res.status(200).json({ email: userEmail });
    } else {
      return res.status(404).json({ message: 'No email found' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
