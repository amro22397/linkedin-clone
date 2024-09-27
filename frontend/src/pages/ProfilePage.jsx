import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React from 'react'
import ProfileHeader from '../components/ProfileHeader'
import AboutSection from '../components/AboutSection'
import ExperienceSection from '../components/ExperienceSection'
import SkillsSection from '../components/SkillsSection'
import EducationSection from '../components/EducationSection'
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const ProfilePage = () => {
    const { username } = useParams();
    console.log(username)
	const queryClient = useQueryClient();

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

    console.log(authUser)

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: () => axiosInstance.get(`/users/${username}`),
	});

    console.log(userProfile)

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

	if (isLoading || isUserProfileLoading) return (
        <Loader className='animate-spin' />
    );

	const isOwnProfile = authUser.username === userProfile?.data?.username;
	const userData = isOwnProfile ? authUser : userProfile?.data;

    


    const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

  return (
    <div className='max-w-4xl mx-auto p-4'>
            <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
			<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
    </div>
  )
}

export default ProfilePage
