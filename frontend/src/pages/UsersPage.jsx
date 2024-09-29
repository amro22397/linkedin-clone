import React from 'react'
import Sidebar from '../components/auth/SideBar'
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import UserCard from '../components/UserCard';

const UsersPage = () => {
    const { data: user } = useQuery({ queryKey: ["authUser"] });
    console.log(user)

    const { data: users } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users");
			return res.data;
		},
	});

    console.log(users)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={user} />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
								{users?.map((connection) => (
									<UserCard authUser={user}key={connection._id} user={connection} isConnection={true} />
								))}
							</div>
        

        

        <div className="">
        </div>
        </div>

        
      </div>
    </div>
  )
}

export default UsersPage
