import { formatDistanceToNow } from 'date-fns'
import { Edit, Loader, Trash } from 'lucide-react';
import React, { useState } from 'react'
import DeleteMessage from './DeleteMessage';
import { axiosInstance } from '../lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const PostComment = ({post, comment, authUser}) => {

    const isCommentOwner = authUser._id === comment.user._id;

    const [isCommentEditing, setIsCommentEditing] = useState(false);

    const [deleteMessage, setDeleteMessage] = useState(false);

    const [newComment, setNewComment] = useState(null);


    const queryClient = useQueryClient();



    const { mutate: deleteComment, isPending:isDeletingComment } = useMutation({
        mutationFn: async () => {
            await axiosInstance.delete(`/posts/delete/${post._id}/${comment._id}/comment`);
        },

        onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Comment deleted successfully");
            window.location.reload();

		},

        onError: (error) => {
			toast.error(error.message);
		},
    });



    const { mutate: editComment, isPending: isEditingComment } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.put(`/posts/edit/${post._id}`, postData);
		},
		onSuccess: () => {
			toast.success("Post edited successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to edit post");
		},
	});





    const handleDeleteComment = () => {
        deleteComment();
    }

    const handleEditComment = () => {
        e.preventDefault();
    }

  return (
    <div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start relative'>
        
        {deleteMessage && (
            <DeleteMessage text={'Are you sure you want to delete this comment?'}
            setDeleteMessage={setDeleteMessage} handleDeletePost={handleDeleteComment} />
        )}
        
                {isCommentOwner && (
						<div className="flex flex-row gap-3 items-center mx-2
                        absolute right-[9px] top-[11px]">
							<button onClick={() => setIsCommentEditing(true)}
							className='text-green-600 hover:text-green-800 hidden'>
							{isEditingComment ? <Loader size={18} className='animate-spin' /> : <Edit size={18} />}
							</button>

							<button onClick={() => setDeleteMessage(true)} className='text-red-500 hover:text-red-700'>
							{isDeletingComment ? <Loader size={18} className='animate-spin' /> : <Trash size={18} />}
						</button>
						</div>
					)}



    <img
        src={comment.user.profilePicture || "/avatar.png"}
        alt={comment.user.name}
        className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
    />
    <div className='flex-grow'>
        <div className='flex items-center mb-1'>
            <span className='font-semibold mr-2'>{comment.user.name}</span>
            
            <span className='text-xs text-info'>
                {formatDistanceToNow(new Date(comment.createdAt))}
            </span>
            
        </div>
        {isCommentEditing ? (

            <form onSubmit={handleEditComment} className='flex items-center
            gap-2'>
            <input
                type='text'
                defaultValue={newComment || comment.content}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Edit your comment'
                className='flex-grow px-4 py-[7px] rounded-full bg-white focus:border-none
                active:outline-none focus:outline-none text-sm
                '
            />
            
            <div className="flex flex-row gap-1 items-center">
            <button
            onClick={() => setIsCommentEditing(false)}
                type='button'
                className='bg-primary text-white px-2 py-[2.5px] rounded-md hover:bg-primary-dark transition duration-300
                cursor-pointer'
                disabled={false}
            >
                {false ? <Loader size={18} className='animate-spin' /> : 'Cancel'}
            </button>

            <button
                type='submit'
                className='bg-primary text-white px-[10.5px] py-[2.5px] rounded-md hover:bg-primary-dark transition duration-300
                cursor-pointer'
                disabled={false}
            >
                {false ? <Loader size={18} className='animate-spin' /> : 'Ok'}
            </button>
            </div>


        </form>

        ) : (
            <p>{comment.content}</p>

        )}
    </div>
</div>
  )
}

export default PostComment
