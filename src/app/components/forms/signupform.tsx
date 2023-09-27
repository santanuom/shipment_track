"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

  const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    role:z.string().min(1, 'Password is required'),
    contactNo:z.string(),
    vehicleno:z.string(),
    licenceNo:z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

const SignUpForm = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (selectedValue: string) => {
    // Update the state with the selected value
    setSelectedOption(selectedValue);
  
    // Do any other actions you need to perform when the select box is clicked
    console.log('Selected value:', selectedValue);
  };
  
  const { toast } = useToast()
    const router =useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      contactNo: '',
      vehicleno: '',
      licenceNo: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // const { role } = values; 
  console.log(values.role === 'driver') 
  if(values.role === 'driver'){
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      username: values.username,
      email: values.email,
      password: values.password,
      role: values.role,
      contactNo: values.contactNo,
      licenceNo: values.licenceNo,
      vehiclenumber: values.vehicleno
      })
      })
      if(response.ok){
        router.push('/auth/sign-in');
    }else{
      toast({
        title: "Error!",
        description: "Oops! Something went wrong!",
        variant:'destructive'
      })
    }
  }else if(values.role !== 'driver'){
    const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values. password,
        role: values.role
        })
        })
        if(response.ok){
            router.push('/auth/sign-in');
        }else{
          toast({
            title: "Error!",
            description: "Oops! Something went wrong!",
            variant:'destructive'
          })
        }
  }
        
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='johndoe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='mail@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-Enter your password</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Re-Enter your password'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter a role</FormLabel>
                <FormControl>
                <Select  onValueChange={(value) => {field.onChange(value);handleSelectChange(value)}} defaultValue={field.value}>
<SelectTrigger >
<SelectValue placeholder="Select a Role" />
</SelectTrigger>
<SelectContent>
<SelectGroup>
  {/* <SelectLabel>Role</SelectLabel> */}
  <SelectItem value="admin">Admin</SelectItem>
  <SelectItem value="driver">Driver</SelectItem>
  <SelectItem value="manager">Manager</SelectItem>
</SelectGroup>
</SelectContent>
</Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedOption === 'driver' && (
          <>
            <FormField
              control={form.control}
              name='contactNo'
              render={({ field }) => (
                <div>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <input type="text" {...field} />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name='vehicleno'
              render={({ field }) => (
                <div>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <input type="text" {...field} />
                  </FormControl>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name='licenceNo'
              render={({ field }) => (
                <div>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <input type="text" {...field} />
                  </FormControl>
                </div>
              )}
            />
          </>
        )}
        </div>
        <Button className='w-full mt-6' type='submit'>
          Sign up
        </Button>
      </form>
      <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
        or
      </div>
      {/* <GoogleSignInButton>Sign up with Google</GoogleSignInButton> */}
      <p className='text-center text-sm text-gray-600 mt-2'>
        If you don&apos;t have an account, please&nbsp;
        <Link className='text-blue-500 hover:underline' href='/auth/sign-in'>
          Sign in
        </Link>
      </p>
    </Form>
  );
};

export default SignUpForm;