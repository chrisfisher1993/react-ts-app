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

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

interface Post {
  id: number;
  title: string;
}

const fetchUserProfile = async (
  userId: string
): Promise<{ user: User; posts: Post[] }> => {
  const user: User = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  ).then((res) => res.json());
  const posts: Post[] = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
  ).then((res) => res.json());
  return { user, posts };
};

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid user ID</div>;
  }

  const { data, isLoading, error } = useQuery<{
    user: User;
    posts: Post[];
  }>({
    queryKey: ["userProfile", id],
    queryFn: () => fetchUserProfile(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <Container>
      <Typography variant="h4">{data.user.name}</Typography>
      <Typography variant="body1">{data.user.email}</Typography>
      <Typography variant="body1">{data.user.company.name}</Typography>
      <Typography variant="h5">Posts</Typography>
      <List>
        {data.posts.map((post) => (
          <ListItem
            button
            component={Link}
            to={`/posts/${post.id}`}
            key={post.id}
          >
            <ListItemText primary={post.title} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UserProfile;
