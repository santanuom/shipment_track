// pages/api/getAllShipments.ts

import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db'; // Import your database configuration

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all shipments from the database
    const allUsers = await db.users.findMany(); // Adjust this based on your database schema

    // Return the shipments as a JSON response
    return res.status(200).json({ allUsers });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
