"use client"

import { useParams } from 'next/navigation';

export default function TestIdPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div>
      <h1>Dynamic Test Page</h1>
      <p>ID from URL: {id}</p>
    </div>
  );
} 