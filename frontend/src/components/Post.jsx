import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import { Edit, Image, Loader, MessageCircle, Send, Share2, ThumbsUp, Trash, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PostAction from './PostAction';
import { formatDistanceToNow } from "date-fns";
import DeleteMessage from './DeleteMessage';


import toast from 'react-hot-toast';
import PostComment from './PostComment';

const Post = ({ post, user }) => {

	const { postId } = useParams();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const [showPostEdit, setShowPostEdit] = useState(false);

	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);


    const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(post.comments || []);

	const [deleteMessage, setDeleteMessage] = useState(false);


    const isOwner = authUser._id === post.author._id;
    const isLiked = post.likes.includes(authUser._id);

    const queryClient = useQueryClient();


    const { mutate: deletePost, isPending:isDeletingPost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.delete(`/posts/delete/${post._id}`);
        },

        onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post deleted successfully");
		},

        onError: (error) => {
			toast.error(error.message);
		},
    });

	/* const [editLoading, setEditLoading] = useState(false);
	const [editError, setEditError] = useState(false);

	console.log(editedPost)

	const editPost = async (e) => {

		
		setEditLoading(true)
		setEditError(false)

		const res = await fetch(`/posts/edit/${post._id}`, {
			method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
			body: JSON.stringify(editedPost)
		});

		const data = await res.json();
		console.log(data)
		setEditLoading(false)

		if (data.success === false) {
			setEditError(data.message);
			console.log(error)
			return
		}
	} */

		const { mutate: editPost, isPending: isEditingPost } = useMutation({
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



	const { mutate: editedPost, isPending } = useMutation({
		mutationFn: async (postData) => {
			const res = await axiosInstance.post("/posts/create", postData, {
				headers: { "Content-Type": "application/json" },
			});
			return res.data;
		},
		onSuccess: () => {
			resetForm();
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to create post");
		},
	});


    const { mutate:createComment, isPending: isAddingComment } = useMutation({
        mutationFn: async (newComment) => {
            await axiosInstance.post(`/posts/${post._id}/comment`, {content:newComment})
        },

        onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Comment added successfully");
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to add comment");
		},

    })

    const { mutate: likePost, isPending: isLikingPost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post(`/posts/${post._id}/like`)
        },

        onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
		},
    })

    const handleDeletePost = () => {
		setDeleteMessage(true);
	};

    const handleLikePost = async () => {
        if (isLikingPost) return;
        likePost();
    }

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return

        createComment(newComment);
        setNewComment("");
        setComments([
            ...comments,
            {
                content: newComment,
                user: {
                    _id: authUser._id,
                    name: authUser.name,
                    profilePicture: authUser.profilePicture,
                },
                createdAt: new Date(),
            }
        ])

    }


	const handleImageChange = (e) => {
		const file = e.target.files[0];
	
		setImage(file);
		if (file) {
			readFileAsDataURL(file).then(setImagePreview);
		} else {
			setImagePreview(null);
		}
	};

	const readFileAsDataURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	};

	const handleEditPost = async () => {
		setShowPostEdit(false);

		try {
			const postData = { content };
			if (image) postData.image = await readFileAsDataURL(image);

			editPost(postData);
		} catch (error) {
			console.error("Error in handleEditPost:", error);
		}
	};

  return (
    <div className="bg-secondary rounded-lg shadow mb-4">
		{deleteMessage && (
				<DeleteMessage text={"Are you sure you want to delete this post?"}
				setDeleteMessage={setDeleteMessage} handleDeletePost={deletePost} />
			)}

			{showPostEdit && (
				<div className="bg-white border border-gray-300 p-3 rounded-lg
				absolute left-0 right-0 max-w-[470px] md:max-w-[600px] mx-auto ">
	
					<div className="flex justify-end mb-3 ">
					<X onClick={() => setShowPostEdit(false)}
					className='hover:text-red-800 cursor-pointer active:transform active:scale-95'/>
					</div>
	
					<div className='flex space-x-3'>
					<img src={user.profilePicture || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />

					<textarea
						className='w-full p-3 rounded-lg bg-gray-100 hover:shadow focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
						defaultValue={post.content || ""}
						onChange={(e) => setContent(e.target.value)}
					/>
				</div>
	
				
					<div className='mt-4 relative flex gap-2 flex-col items-center'>
						
						

						{imagePreview ? (
							<img src={imagePreview} alt='Selected' className='max-w-full max-h-[550px] mx-auto rounded-lg
							border border-gray-300 p-1 object-cover' />
						) : post.image && (
							<img src={post.image} alt='Selected' className='max-w-full max-h-[550px] mx-auto rounded-lg
							border border-gray-300 p-1 object-cover' />
						)}
	
						
					</div>
			
	
				<div className='flex justify-between items-center mt-4'>
					<div className='flex space-x-4'>
					<label className="flex flex-row gap-1 items-center bg-gray-100 px-3 py-2 rounded-lg font-semibold
						border border-gray-300 mb-1 cursor-pointer
						hover:bg-gray-50 active:transform active:scale-95">
						<Edit />
						<span>Edit Photo</span>
						<input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
						</label>
					</div>
	
					<button
						className='bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
						onClick={handleEditPost}
						disabled={isEditingPost}
					>
						{isEditingPost ? <Loader className='size-5 animate-spin' /> : "Share"}
					</button>
				</div>
				</div>
			)}



        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
              <Link to={`/profile/${post?.author?.username}`}>
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className='size-10 rounded-full mr-3'
							/>
						</Link>

                        <div className="">
                        <Link to={`/profile/${post?.author?.username}`}>
								<h3 className='font-semibold'>{post.author.name}</h3>
							</Link>
							<p className='text-xs text-info'>{post.author.headline}</p>
                            <p className='text-xs text-info'>
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							</p>
                        </div>
              </div>

              {isOwner && (
						<div className="flex flex-row gap-3 items-center mx-2">
							<button onClick={() => setShowPostEdit(true)}
							className='text-green-600 hover:text-green-800'>
							{isEditingPost ? <Loader size={18} className='animate-spin' /> : <Edit size={18} />}
							</button>

							<button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
							{isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash size={18} />}
						</button>
						</div>
					)}
            </div>

            <p className='mb-4'>{post.content}</p>
				{post.image && <img src={post.image} alt='Post content' className='rounded-lg max-w-full mb-4
				max-h-[550px] mx-auto' />}

                <div className='flex justify-between text-info'>
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
						text={`Like ${post.likes.length > 0 ? post.likes.length : ""}`}
						onClick={handleLikePost}
					/>

					<PostAction
						icon={<MessageCircle size={18} />}
						text={`Comment ${comments.length > 0 ? comments.length : ""}`}
						onClick={() => setShowComments(!showComments)}
					/>
					<PostAction icon={<Share2 size={18} />} text='Share' />
				</div>
        </div>

        {showComments && (
				<div className='px-4 pb-4'>
					<div className='mb-4 max-h-60 overflow-y-auto'>
						{comments.map((comment) => (
							<PostComment post={post} comment={comment} authUser={authUser} />
						))}
					</div>

                    <form onSubmit={handleAddComment} className='flex items-center'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment'
							className='flex-grow px-4 py-[7px] rounded-l-full bg-base-100 focus:border-none
							active:outline-none focus:outline-none text-sm
							'
						/>

						<button
							type='submit'
							className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
							disabled={isAddingComment}
						>
							{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>

					
				</div>
			)}

    </div>
  )
}

export default Post
