import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const queryClient = useQueryClient();

    const navigate = useNavigate();


    const  { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/login', userData),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"]})
        },

        onError: (err) => {
            toast.error(err.response.data.message || 'Something went wrong')
        },
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
		loginMutation(formData);
    }

    console.log(formData)

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
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
				type='password'
				placeholder='Password'
				id="password"
				defaultValue={formData.password}
				onChange={handleChange}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' className='btn btn-primary w-full'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
			</button>
		</form>
  )
}

export default LoginForm
