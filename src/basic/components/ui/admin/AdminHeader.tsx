// components/admin/AdminHeader.tsx

interface AdminHeaderProps {
  title: string;
  description: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">{description}</p>
    </div>
  );
}