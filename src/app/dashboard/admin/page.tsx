'use client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

  import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
// import { GET } from "@/app/api/pages/getAllShipments";

const formSchema = z.object({
  actualdeliverydate: z.string(),
  customername:z.string().min(5, {
    message: "customername must be at least 2 characters.",
  }),
  destinationaddress:z.string().min(5, {
    message: "destinationaddress must be at least 2 characters.",
  }),
  shipmentstatus:z.string().min(5, {
    message: "shipmentstatus must be at least 2 characters.",
  }),
  assigneddriverid: z.string(),
  planneddeliverydate:z.string(),
})

  const Admin = () => {
    const router =useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        actualdeliverydate: "",
        customername: "",
        destinationaddress: "",
        shipmentstatus: "",
        assigneddriverid: "",
        planneddeliverydate: "",
      },
    })
    const [isEditing, setIsEditing] = useState(false);
const [editingShipment, setEditingShipment] = useState(null);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customername: values.customername,
          destinationaddress: values.destinationaddress,
          shipmentstatus: values.shipmentstatus,
          assigneddriverid: values.assigneddriverid,
          planneddeliverydate: values.planneddeliverydate,
          actualdeliverydate: values.actualdeliverydate,
        })
        })
        if(response.ok){
          toast({
            title: "Success!",
            description: `Shipments Assigned Successfully to ${values.assigneddriverid}`,
          })
            router.push('/dashboard/home');
      }else{
        toast({
          title: "Error!",
          description: "Oops! Something went wrong!",
          variant:'destructive'
        })
      }
      };

      const [shipments, setShipments] = useState([]);
      const fetchDataUser = async () => {
        try {
          const requestOptions: RequestInit = {
            method: "POST",
            redirect: "follow",
          };
    
          const response = await fetch(
            `/api/getShipments`,
            requestOptions
          );
          if (response.ok) {
            const Userresult = await response.json();
            // toast.success("Data Fetched successfully");
    
            setShipments(Userresult.data);

            console.log(Userresult.data);

          } else {
            console.log("Failed to fetch data");
            // toast.error("Failed to fetch data");
          }
        } catch (error) {
          console.error('Something went wrong', error);
        }
      };
    
      useEffect(() => {
        fetchDataUser(); // Call fetchDataUser on page load
      }, []);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = () => {
    // Perform the delete action here
    // ...
    console.log("SAVE")
    setShowDeleteConfirmation(false);
  };
  const handleEditClick = (data:any) => {
    setEditingShipment(data);
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setEditingShipment(null);
    setIsEditing(false);
  };
  const dialogContentStyle = {
    maxHeight: '300px', // Set the desired height here
    overflowY: 'auto', // Add scrollbars if content exceeds the height
  }

    return <Dialog><div className="w-full">
      <DialogTrigger asChild><Button variant="destructive" style={{float: 'right'}} onClick={handleDeleteClick}>Add Shipment</Button></DialogTrigger>
      <Table className="w-full">
    <TableCaption>Shipment Records</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="text-centre">Customer Name</TableHead>
        <TableHead className="text-centre">Assigned Driver</TableHead>
        <TableHead className="text-centre">Destination Address</TableHead>
        <TableHead className="text-centre">Plan Delivery Date</TableHead>
        <TableHead className="text-centre">Actual Delivery Date</TableHead>
        <TableHead className="text-centre">Status</TableHead>
        <TableHead className="text-right">Action</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>{shipments.map((data:any) =>(
    <TableRow key={data.id}>
        <TableCell className="text-centre">{data.customername}</TableCell>
        <TableCell className="text-centre">{data.assigneddriverid}</TableCell>
        <TableCell className="text-centre">{data.destinationaddress} </TableCell>
        <TableCell className="text-centre">{format(new Date(data.planneddeliverydate), 'dd/MM/yyyy')}</TableCell>
        <TableCell className="text-centre">{format(new Date(data.actualdeliverydate), 'dd/MM/yyyy')}</TableCell>
        <TableCell className="text-centre">{data.shipmentstatus}</TableCell>
        <TableCell className="text-right">
            <Button><FaEdit className="edit-icon" onClick={() => handleEditClick(data)}/> </Button>&nbsp;
            <Button><FaTrash className="delete-icon" /> </Button>
      </TableCell>
      </TableRow>
      ))}
    </TableBody>
  </Table>
  <DialogContent className="sm:max-w-[800px]" style={{maxHeight:'750px',overflowY: 'auto'}}>
        <DialogHeader>
          <DialogTitle>Assigned Shipment</DialogTitle>
          <DialogDescription>
            {showDeleteConfirmation
              ? "If you want to Assign Shipment to the driver Please fill the forms?"
              : "Make changes to your profile here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Write Your customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="destinationaddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Address</FormLabel>
              <FormControl>
                <Input placeholder="Write Your destination address " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="actualdeliverydate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Actual Delivery Date</FormLabel>
              <FormControl>
                <Input placeholder="Write a actual delivery date" {...field} type="date"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="shipmentstatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input placeholder="Write a Status" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="assigneddriverid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned Driver Id</FormLabel>
              <FormControl>
                <Input placeholder="Assigned Driver Id" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="planneddeliverydate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Del Date</FormLabel>
              <FormControl>
                <Input placeholder="Plan Delivery Date" {...field} type="date"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <Button type="submit">Assign Shipment</Button>
         {/* <Button onClick={handleDeleteClick}>Cancel</Button> */}
      </form>
    </Form>
        </div>
      </DialogContent>
  </div>
  </Dialog>
}

  export default Admin;