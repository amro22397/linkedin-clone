import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Edit, Loader, Trash, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DeleteMessage from "./DeleteMessage";


function UserCard({ authUser, user, isConnection }) {

	const [deleteMessage, setDeleteMessage] = useState(false);
	const [showUserEdit, setShowUserEdit] = useState(false);


	const queryClient = useQueryClient();

	const navigate = useNavigate();

	const { data: connectionStatus, isLoading } = useQuery( {
		queryKey: ["connectionStatus", user._id],
		queryFn: () => axiosInstance.get(`/connections/status/${user._id}`)
	  })

	const {mutate: sendConnectionRequest, isPending:isSendingConnection } = useMutation( {
		mutationFn: (userId) => axiosInstance.post(`connections/request/${user._id}`),
	
		onSuccess: () => {
				toast.success("Connection request sent successfully");
				queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
			},
			onError: (error) => {
				toast.error(error.response?.data?.error || "An error occurred");
			},
	
	  })




	  const { mutate: acceptRequest, isPending:isAcceptingRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`connections/accept/${requestId}`),
	
		onSuccess: () => {
				toast.success("Connection request accepted");
				queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
			},
			onError: (error) => {
				toast.error(error.response?.data?.error || "An error occurred");
			},
	  })
	
	  const { mutate: rejectRequest, isPending:isRejectingRequest } = useMutation({
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
			window.location.reload();

		},

        onError: (error) => {
			toast.error(error.message);
		},
    });




	const { mutate: deleteUser, isPending:isDeletingUser } = useMutation({
        mutationFn: async () => {
            await axiosInstance.delete(`/users/delete/${user._id}`);
        },

        onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User deleted successfully");
			window.location.reload();

		},

        onError: (error) => {
			toast.error(error.message);
		},
    });





	  const handleConnect = () => {
		if(connectionStatus?.data?.status === "not_connected") {
		  sendConnectionRequest(user._id)
		}
	  }

	  
	  
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md
		relative'>
			
			
			
			{showUserEdit && (
				<div className="bg-white border border-gray-300 p-3 rounded-lg
				absolute left-0 right-0 w-[600px] mx-auto z-50 ">
	
					<div className="flex justify-end mb-3 ">
					<X onClick={() => setShowUserEdit(false)}
					className='hover:text-red-800 cursor-pointer active:transform active:scale-95'/>
					</div>
	
					
				</div>
			)}




			
				{deleteMessage && (
					<DeleteMessage text={'Are you sure you want to delete this user?'}
					setDeleteMessage={setDeleteMessage} handleDeletePost={() => deleteUser(user._id)} />
				)}
			

			{authUser?.isAdmin && (
				<>
				<Edit onClick={() => setShowUserEdit(true)}
				 className="absolute right-3 text-green-700 hover:text-green-800 active:transform active:scale-95
				 hidden" 
			size={23}/>

			<Trash onClick={() => setDeleteMessage(true)}
			className="absolute right-3 text-red-700 hover:text-red-800 active:transform active:scale-95" 
			size={23}/>
				</>
			)}

			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-4'
				/>
				<h3 className='font-semibold text-lg text-center'>{user.name}</h3>
			</Link>
			<p className='text-gray-600 text-center'>{user.headline}</p>
			<p className='text-sm text-gray-500 mt-2'>{user.connections?.length} connections</p>

			{connectionStatus?.data?.status === "connected" && (
				<button onClick={removeConnection} 
				disabled={isDeletingConnection}
				className='mt-4 bg-red-800 active:transform active:scale-95 text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isDeletingConnection ? <Loader className="animate-spin mx-auto"/> : "Remove"}
			</button>
			)}

			{connectionStatus?.data?.status === "not_connected" && (
				<button onClick={handleConnect}
				disabled={isSendingConnection}
				className='mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isSendingConnection ? <Loader className="animate-spin mx-auto"/> : "Connect"}
			</button>
			)}
			
			{connectionStatus?.data?.status === "pending" && (
				<button onClick={removeConnection}
				disabled={isDeletingConnection}
				className='mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors w-full'>
				{isDeletingConnection ? <Loader className="animate-spin mx-auto"/> : "Pending"}
			</button>
			)}
			
			{connectionStatus?.data?.status === "received" && (
				<div className="flex flex-row gap-2">
					<button onClick={() => acceptRequest(connectionStatus.data.requestId)}
				disabled={isAcceptingRequest}
				className='mt-4 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-500 transition-colors w-full'>
				{isAcceptingRequest ? <Loader className="animate-spin mx-auto"/> : "Accept"}
				</button>

				<button onClick={() => rejectRequest(connectionStatus.data.requestId)}
				disabled={isRejectingRequest}
				className='mt-4 bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors w-full'>
				{isRejectingRequest ? <Loader className="animate-spin mx-auto"/> : "Reject"}
				</button>
				</div>
				

			)}
		</div>
	);
}

export default UserCard;