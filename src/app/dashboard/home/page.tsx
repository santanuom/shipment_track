import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import DriverDashboard from "../driver/page";
import Admin from "../admin/page";


const  Dashboard = async ()=> {
    const session = await getServerSession(authOptions);
    console.log(session?.user)
    if(session?.user.role === 'admin' || session?.user.role === 'manager'){
        return <div className="w-full"><Admin></Admin></div>
    }
    if(session?.user.role === 'driver'){
        return <div className="w-full"><DriverDashboard></DriverDashboard></div>
    }else{
        throw new Error('You Are not authorized!')
    }
    // return <h2 className='text-4xl'>Please login as you are not authorized here in this Dashboard page</h2>
  }

  export default Dashboard;