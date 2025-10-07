import { IconBook } from '@tabler/icons-react';

const posts = [
  { title: 'Launching Squadbox Beta', excerpt: 'A new way to build apps with AI...' },
  { title: 'Inside MMRY Neural Folding', excerpt: 'How we achieve extreme compression ratios...' },
  { title: 'Templates that Ship Faster', excerpt: 'Why starting from the right template matters...' },
];

const BlogPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconBook size={32} color="var(--mantine-color-brand-6)" />
      Blog
    </Title>
    <Stack>
      {posts.map((p) => (
        <Card key={p.title} p="lg" withBorder>
          <Title order={3} m={0}>{p.title}</Title>
          <Text c="dimmed" size="sm" mt="xs">{p.excerpt}</Text>
        </Card>
      ))}
    </Stack>
  </Container>
);

export default BlogPage;


