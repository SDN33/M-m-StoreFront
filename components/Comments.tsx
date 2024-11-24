"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  authorAvatar: string | null;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Fonction pour extraire les initiales d'un nom
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const Comments: React.FC<{ postId: number }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/commentaires?post=${postId}`);
        const data = await response.json();

        if (data.success && data.comments) {
          setComments(data.comments);
        } else {
          setError("Erreur lors de la récupération des commentaires.");
        }
      } catch (err) {
        setError(`Erreur : ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (isLoading) return <p>Chargement des commentaires...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (comments.length === 0) return <p>Aucun commentaire pour cet article.</p>;

  return (
    <section className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Commentaires</h2>
      <ul className="space-y-6">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm text-black"
          >
            <div className="flex items-center mb-4">
              {comment.authorAvatar ? (
                <Image
                  src={comment.authorAvatar || "/default-avatar.png"}
                  alt={`Avatar de ${comment.author}`}
                  className="rounded-full mr-3"
                  width={40}
                  height={40}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mr-3"
                  title={comment.author}
                >
                  {getInitials(comment.author)}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">
                  Par <span className="font-semibold text-primary">{comment.author}</span>,{" "}
                  le {formatDate(comment.date)}
                </p>
              </div>
            </div>
            <div
              className="prose prose-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Comments;
