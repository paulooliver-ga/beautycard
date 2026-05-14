export default function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  return <main className="min-h-screen">{children}</main>;
}