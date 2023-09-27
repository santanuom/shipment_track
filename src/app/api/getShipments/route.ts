// import db from '../../../Database/db';
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST( req: NextResponse,res: NextResponse) {
  try {

    const query = 'SELECT * FROM shipments';
    const result = await db.query(query);
    const user = result.rows;
  console.log("=======>",user)

    if (!user) {
      console.log("error: Something went wrong");
      return NextResponse.json({ error: 'Something is wrong' },{status: 401});
    }
      return NextResponse.json({ message: 'Executed successful',data:user },{status: 200});
  } catch (error) {
    console.error('Error logging in:', error);
    
    return NextResponse.json({ error: 'Internal Server Error' });
  }
};
