'use client';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DriverDashboard = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Driver Dashboard:</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <caption className="text-lg font-semibold">Shipment Records</caption>
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Driver Name</th>
              <th className="py-2 px-4">Item Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4 text-right">Status</th>
              <th className="py-2 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200">
              <td className="py-2 px-4 font-medium">Jimmy</td>
              <td className="py-2 px-4">TV</td>
              <td className="py-2 px-4">45" LED TV</td>
              <td className="py-2 px-4 text-right">In Transit</td>
              <td className="py-2 px-4 text-right">
                <Button className="mr-2">
                  <FaEdit className="edit-icon" />
                </Button>
                <Button>
                  <FaTrash className="delete-icon" />
                </Button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default DriverDashboard;
