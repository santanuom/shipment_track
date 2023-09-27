import db from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:any, res:any) {
  console.log(req)
  const payload = await req.json();
  let client; // Declare the client variable here

  try {
    // Start a database transaction
    client = await db.connect();
    await client.query('BEGIN');

      const userQuery =
        "INSERT INTO shipments (customername, destinationaddress, shipmentstatus,assigneddriverid,planneddeliverydate,actualdeliverydate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING shipmentid";
      const userValues = [
        payload.customername,
        payload.destinationaddress,
        payload.shipmentstatus,
        payload.assigneddriverid,
        payload.planneddeliverydate,
        payload.actualdeliverydate,
      ];
      const shipmentRes = await client.query(userQuery, userValues);
      await client.query('COMMIT');
    client.release();

    return NextResponse.json(
      { message: "Shipment Assigned Successfully." },
      { status: 201 }
    );
  } catch (error) {
    // Rollback the transaction on error
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }

    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while assigning the shipment driver." },
      { status: 500 }
    );
  }
}