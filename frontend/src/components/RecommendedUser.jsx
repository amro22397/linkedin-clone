import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';
import { Check, Clock, Loader, UserCheck, UserPlus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const RecommendedUser = ({user}) => {

  const queryClient = useQueryClient();

  const { data: connectionStatus, isLoading } = useQuery( {
    queryKey: ["connectionStatus", user._id],
    queryFn: () => axiosInstance.get(`/connections/status/${user._id}`)
  })

  const {mutate: sendConnectionRequest } = useMutation( {
    mutationFn: (userId) => axiosInstance.post(`connections/request/${user._id}`),

    onSuccess: () => {
			toast.success("Connection request sent successfully");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},

  })

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`connections/accept/${requestId}`),

    onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.error || "An error occurred");
		},
  })

  const { mutate: rejectRequest } = useMutation({
	mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
	onSuccess: () => {
		toast.success("Connection request rejected");
		queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
	},
	onError: (error) => {
		toast.error(error.response?.data?.error || "An error occurred");
	},
});

const { mutate: removeConnection, isPending:isDeletingConnection } = useMutation({
	mutationFn: async () => {
		await axiosInstance.delete(`/connections/${user._id}`);
	},

	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
		toast.success("Connection deleted successfully");

	},

	onError: (error) => {
		toast.error(error.message);
	},
});

  

  const renderButton = () => {

    if (isLoading) {
			return (
				<button className='px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500' disabled>
					Loading...
				</button>
			);
		}
    
    switch (connectionStatus?.data?.status) {
      case "pending":
        return (
          <button
		  
						className='px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center
						'
						disabled
					>
						
						{isDeletingConnection ? <Loader className='animate-spin mx-auto' /> : <>
							<Clock size={16} className='mr-1' /> Pending
						</>}
					</button>
        );

        case "received":
          return (
            <div className='flex gap-2 justify-center'>
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
						>
							<Check size={16} />
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
						>
							<X size={16} />
						</button>
					</div>
          );

          case "connected":
            return (
              <button
						className='px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center'
						disabled
					>
						<UserCheck size={16} className='mr-1' />
						Connected
					</button>
            );

            default:
				return (
					<button
						className='px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center'
						onClick={handleConnect}
					>
						<UserPlus size={16} className='mr-1' />
						Connect
					</button>
				);

        

    }
  }

  const handleConnect = () => {
    if(connectionStatus?.data?.status === "not_connected") {
      sendConnectionRequest(user._id)
    }
  }

  return (
    <div className="flex flex-row items-center justify-between mb-4 max-xl:flex-col max-xl:gap-4">
      <Link to={`/profile/${user.username}`} className='flex items-center flex-grow '>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-12 h-12 rounded-full mr-3'
				/>
				<div className='w-[50%] flex flex-col gap-1'>
					<h3 className='font-semibold text-sm'>{user.name}</h3>
					<p className='text-xs text-info'>{user.headline}</p>
				</div>
			</Link>
      {renderButton()}
    </div>
  )
}

export default RecommendedUser
