import { Card, Skeleton, CardContent } from '@mui/material';

export default function PostCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={140} />
      <CardContent>
        <Skeleton width="60%" />
        <Skeleton width="80%" />
        <Skeleton width="40%" />
      </CardContent>
    </Card>
  );
}
