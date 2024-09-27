import React, { useState } from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";


const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
    });

    const queryClient = useQueryClient();

    const { mutate: signUpMutation, isLoading } = useMutation({
		mutationFn: async (data) => {
			const res = await axiosInstance.post("/auth/signup", data);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Something went wrong");
		},
	});


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        signUpMutation(formData);

    }

console.log(formData)
  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">

<input
				type='text'
				placeholder='Full name'
                id="name"
				defaultValue={formData.name}
				onChange={handleChange}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='text'
				placeholder='Username'
				id="username"
				defaultValue={formData.username}
				onChange={handleChange}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='email'
				placeholder='Email'
				id="email"
				defaultValue={formData.email}
				onChange={handleChange}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password (6+ characters)'
				id="password"
				defaultValue={formData.password}
				onChange={handleChange}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' disabled={isLoading} className='btn btn-primary w-full text-white'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Agree & Join"}
			</button>

    </form>
  )
}

export default SignUpForm
