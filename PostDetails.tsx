import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

interface Comment {
  id: number;
  body: string;
  email: string;
}

const fetchPostDetails = async (postId: string) => {
  const post: Post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  ).then((res) => res.json());
  const user: User = await fetch(
    `https://jsonplaceholder.typicode.com/users/${post.userId}`
  ).then((res) => res.json());
  const comments: Comment[] = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  ).then((res) => res.json());
  return { post, user, comments };
};

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid post ID</div>;
  }

  const { data, isLoading, error } = useQuery<{
    post: Post;
    user: User;
    comments: Comment[];
  }>({
    queryKey: ["postDetails", id],
    queryFn: () => fetchPostDetails(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <Container>
      <Typography variant="h4">{data.post.title}</Typography>
      <Typography variant="body1">{data.post.body}</Typography>
      <Link to={`/users/${data.user.id}`}>{data.user.name}</Link>
      <Typography variant="h5">Comments</Typography>
      <List>
        {data.comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText primary={comment.body} secondary={comment.email} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PostDetails;
