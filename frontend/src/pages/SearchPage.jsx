import React, { useEffect, useState } from 'react'
import Sidebar from '../components/auth/SideBar'
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import User from '../../../backend/models/user.model';

const SearchPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [eachuser, setEachUser] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const [searchTerm, setSearchTerm] = useState();

    const [searchURL, setSearchURL] = useState('');

    const { data: searchUsers } = useQuery({
        queryKey: ["searchUsers"],
        queryFn: async () => {
            const res = await axiosInstance.get(`/users/search?${searchURL}`);
            return res.data;
        },
    });

    console.log(searchURL)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }

        

    }, [location.search]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', searchTerm);

        const searchQuery = urlParams.toString();
        setSearchURL(searchQuery);
        navigate(`/search?${searchQuery}`)
    }



    const { data: user } = useQuery({ queryKey: ["authUser"] });


  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={user} />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Search Result</h1>

        <form onSubmit={handleSubmit} 
        className="bg-white border border-gray-200 px-4 py-[6px] rounded-full
						w-[45%] flex flex-row justify-between">
                            
                            <input type="text" id='searchTerm'
                            placeholder='Search'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='active:outline-none focus:outline-none
							w-full text-sm' />

							<button type='submit'
							><Search size={20} /></button>
        </form>

        <div className="">
        </div>
        </div>

        
      </div>
    </div>
  )
}

export default SearchPage
