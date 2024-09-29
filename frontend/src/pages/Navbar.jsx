import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Home, LogOut, Network, Search, User, Users, Users2, Users2Icon, UserSearch, UsersRound } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Navbar = () => {
  const {data: authUser} = useQuery({queryKey: ["authUser"],})

  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");

  const {data: notifications} = useQuery({
    queryKey: ["notifications"],
    queryFn: async() => axiosInstance.get('/notifications'),
    enabled: !!authUser,
  })

  const { data:connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async() => axiosInstance.get('/connections/requests'),
    enabled: !!authUser,
  })

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"]})
    }
  });

  console.log(notifications, connectionRequests)

  const unreadNotificationCount = notifications?.data?.filter(notif => !notif.read).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

	const urlParams = new URLSearchParams(window.location.search);
	urlParams.set("searchTerm", searchTerm);
	const searchQuery = urlParams.toString();
	navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
		setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
			<div className='max-w-7xl mx-auto px-4 z-50'>
				<div className='flex justify-between items-center py-3 z-50'>
					<div className='flex items-center space-x-4'>
						<Link to='/'>
							<img className='h-8 rounded' src='/small-logo.png' alt='LinkedIn' />
						</Link>
					</div>

					
						<form onSubmit={handleSubmit}
						className="bg-white border border-gray-200 px-4 py-[6px] rounded-full
						w-[45%] flex flex-row justify-between hidden">

							<input type="text" placeholder='Search'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='active:outline-none focus:outline-none
							w-full text-sm' />

							<button type='submit'
							><Search size={20} /></button>	

						</form>	
					

					<div className='flex items-center gap-2 md:gap-6'>
						{authUser ? (
							<div className='flex flex-row items-center gap-8'>
								<div className="flex flex-row items-center gap-6">
								<Link to={"/"} className='text-neutral flex flex-col items-center'>
									<Home size={20} />
									<span className='text-xs hidden md:block'>Home</span>
								</Link>
								<Link to={"/users"} className='text-neutral flex flex-col items-center'>
									<Users2 size={20} />
									<span className='text-xs hidden md:block'>Users</span>
								</Link>
								<Link to='/network' className='text-neutral flex flex-col items-center relative'>
									<Network size={20} />
									<span className='text-xs hidden md:block'>My Network</span>
									{unreadConnectionRequestsCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadConnectionRequestsCount}
										</span>
									)}
								</Link>
								<Link to='/notifications' className='text-neutral flex flex-col items-center relative'>
									<Bell size={20} />
									<span className='text-xs hidden md:block'>Notifications</span>
									{unreadNotificationCount > 0 && (
										<span
											className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
										>
											{unreadNotificationCount}
										</span>
									)}
								</Link>
								<Link
									to={`/profile/${authUser.username}`}
									className='text-neutral flex flex-col items-center'
								>
									<User size={20} />
									<span className=  'text-xs hidden md:block'>Me</span>
								</Link>
								</div>
								<button
									className='flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800'
									onClick={() => logout()}
								>
									<LogOut size={20} />
									<span className='hidden md:inline'>Logout</span>
								</button>
							</div>
						) : (
							<>
								<Link to='/login' className='btn btn-ghost'>
									Sign In
								</Link>
								<Link to='/signup' className='btn btn-primary'>
									Join now
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
  )
}

export default Navbar
